## Context

S3Streamer currently runs entirely client-side for UI state, streaming media directly from S3 via presigned URLs fetched from an Express API. The video listing page (`index.html`) renders thumbnails, and clicking a thumbnail opens a custom dialog wrapping a native `<video>` player. We need to persist playback progress locally in the browser and visually display this progress under each thumbnail using an elegant, glowing Emerald styling that is fully aligned with the upcoming dark-themed Radix UI design.

## Goals / Non-Goals

**Goals:**
- Persist video progress (currentTime, duration, updatedAt) under a single `localStorage` key.
- Resume playback seamlessly when a video is re-opened.
- Show an Emerald progress bar under each video card in the main grid reflecting completion percentage.
- Periodically prune old progress entries (older than 30 days) to keep localStorage lightweight.
- Update grid card progress in real-time as the video plays to keep the UI in sync.

**Non-Goals:**
- Synching playback progress across multiple devices (cloud synching).
- Saving progress in a backend database.
- Adding manual "mark as watched" or progress-reset buttons (to keep UI clean and simple).

## Decisions

### Decision 1: Unified JSON Structure in LocalStorage
- **Rationale**: Saving all video progressions inside a single JSON object under the key `s3streamer_playback_progress` keeps the namespace clean. It makes listing, updating, and cleaning up entries extremely efficient.
- **Alternatives Considered**: Individual keys per video (e.g. `s3_progress_video_path.mp4`). This was discarded because it pollutes the `localStorage` namespace and makes garbage collection of old entries complex.

### Decision 2: Video Identification via Relative S3 Key
- **Rationale**: The S3 relative key (e.g., `folder/video.mp4`) is stable, unique, and static.
- **Alternatives Considered**: The streaming URL. Discarded because presigned URLs contain temporary security tokens and expires/parameters that change on every API fetch.

### Decision 3: 5-Second Throttled Writes & On-Demand Immediate Saving
- **Rationale**: The HTML5 `<video>` element's `timeupdate` event fires multiple times per second. Writing to `localStorage` on every tick is a performance bottleneck. Throttling to once every 5 seconds is lightweight, while immediate saves on `pause` and video dialog closure guarantee that no user progress is lost.
- **Alternatives Considered**: Saving on every `timeupdate` tick (unnecessary disk writes) or saving only on exit (risks losing progress if the browser crashes or tab is killed).

### Decision 4: Glowing Emerald Accent Palette (`#10b981`)
- **Rationale**: The upcoming React/Radix refactor introduces a modern dark theme (`bg-slate-950`). The color Emerald matches this modern palette perfectly, creating an immersive, premium "glowing" aesthetic under each vignette thumbnail on hover and focus.

## Risks / Trade-offs

- **[Risk] LocalStorage Storage Limit (5MB)** → *Mitigation*: Our progress payload is extremely lightweight (around 100 bytes per video). On app initialization, a garbage collector deletes any entry older than 30 days. Additionally, entries reaching 95% progress are automatically deleted.
- **[Risk] Video element seek failure before metadata is loaded** → *Mitigation*: Set `currentTime` only after the native `loadedmetadata` event has fired.
- **[Risk] Out-of-sync progress bars when closing player** → *Mitigation*: Dynamically query and update the grid card's progress bar in the DOM during the player's continuous playback saving.
