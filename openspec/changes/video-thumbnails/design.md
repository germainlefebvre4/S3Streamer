## Context

S3Streamer currently runs on an Express backend serving a single-page HTML client (`index.html`). The front end lists videos retrieved from an S3 bucket and displays them in a simple grid where each card has a fixed height of 100px and lists textual metadata (filename, size, modification date). Clicked videos open in a dialog wrapper. This design outlines how we will introduce rich, on-demand server-side thumbnail vignettes and interactive hover previews while maintaining standard layout fallbacks via environment configuration.

## Goals / Non-Goals

**Goals:**
- Dynamically extract 16:9 JPEG thumbnails (320x180) from any video in S3 on-demand.
- Implement a flat-structured disk cache under `src/public/thumbnails/` using MD5 hashes of the S3 key.
- Guarantee that concurrent requests for the same thumbnail trigger only one FFmpeg execution.
- Implement a high-performance interactive preview that plays a muted loop of the video on hover.
- Introduce an `ENABLE_THUMBNAILS` envvar that adapts both backend routing and frontend grid layouts.
- Ensure 100% backward compatibility: when `ENABLE_THUMBNAILS=false`, the grid uses the exact legacy text-only layout.

**Non-Goals:**
- Deploying AWS Lambda functions or setting up S3 upload-triggered events.
- Creating animated GIFs or WebPs for previews (actual video playback is used).
- Supporting manual thumbnail uploads or customization per video.

## Decisions

### Decision 1: Self-Contained Static FFmpeg Binary
- **Rationale**: Relying on the system host to have FFmpeg installed causes setup friction. By utilizing `@ffmpeg-installer/ffmpeg` along with `fluent-ffmpeg`, we bundle static binaries for the platform, ensuring zero-configuration developer onboarding.
- **Alternatives Considered**: Requiring manual local installation of FFmpeg (prone to setup errors), or using a third-party cloud transcoder (adds API costs and dependencies).

### Decision 2: Flat MD5-Based Disk Cache
- **Rationale**: S3 keys may contain folders (e.g. `movies/2026/vacation.mp4`). Creating subdirectories on disk mimicking this tree is complex. Writing flat files named `<md5_hash>.jpg` is clean, robust, and completely protects against Path Traversal vulnerabilities.
- **Alternatives Considered**: Saving thumbnails with full relative pathnames (risks file system creation issues and traversal exploits).

### Decision 3: S3 Signed URL Streaming to FFmpeg
- **Rationale**: Downloading multi-gigabyte video files entirely to the Express server just to extract a single frame is extremely wasteful. S3 natively supports Range requests. By feeding an S3 presigned URL directly into FFmpeg, FFmpeg streams only the first few frames to capture the vignette.
- **Alternatives Considered**: Downloading the video to a temp folder first (unacceptable disk and time overhead).

### Decision 4: Concurrency Protection via Promise Map
- **Rationale**: High concurrency on page refresh could launch dozens of identical FFmpeg processes for the same video. Maintaining an in-memory `activeGenerations` map of key hashes to Promises forces duplicate requests to wait on the single active generation, freeing server resources.
- **Alternatives Considered**: No concurrency protection (risk of CPU exhaustion).

### Decision 5: Adaptive CSS Cards (Visual vs. Compact)
- **Rationale**: Adding the thumbnail visual container as a sub-element inside `.video-item` allows us to toggling its layout via high-level `.visual` and `.compact` CSS classes, ensuring complete reuse of the original card dimensions and alignment when thumbnails are disabled.

### Decision 6: Muted Autoplay Video on Hover (400ms Delay)
- **Rationale**: To prevent initiating heavy video streams as users swipe their cursor across the grid, we introduce a `mouseenter` debounce of 400ms. If the cursor stays over the card, we inject a muted, loopable, absolute-positioned `<video>` starting at `t=2s` to bypass boring intros.

## Risks / Trade-offs

- **[Risk] Heavy server load on initial scroll** → *Mitigation*: Apply `loading="lazy"` on all vignette images so the client browser only triggers thumbnail requests when cards scroll into view.
- **[Risk] Format incompatibility on hover play** → *Mitigation*: Check the file extension in JS (e.g. block `.avi`, `.mkv`) and fallback instantly to the static server-generated JPEG thumbnail (which FFmpeg *can* decode) without attempting hover video playback.
- **[Risk] Canvas tainted security errors** → *Mitigation*: By utilizing standard `<img>` tags and raw video streams directly inside the `<video>` elements, we avoid reading pixels via Canvas on the client side, eliminating CORS-induced canvas errors.
