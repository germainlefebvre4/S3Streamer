## Why

S3Streamer currently displays video cards in a purely text-based grid, making it difficult for users to visually identify and explore their content. Adding server-side on-demand thumbnails and dynamic hover-play previews will transform the interface into a modern, visual streaming platform, while a global environment toggle ensures maximum flexibility for resource-constrained setups.

## What Changes

- **On-Demand Thumbnail Generation**: A new server-side endpoint `/api/videos/thumbnail/:key` will generate, cache, and serve high-performance 16:9 JPEG vignettes on-demand using a static FFmpeg binary.
- **Environment Toggle (`ENABLE_THUMBNAILS`)**: A new environment variable to completely enable/disable visual thumbnails, falling back seamlessly to the legacy text-only compact cards.
- **Interactive Hover Previews**: On-hover video preview playback using muted, looping, and absolute-positioned `<video>` elements with transition effects for supported browser-native formats.
- **Modernized Video Cards**: Redesigned responsive grid cards containing a 16:9 thumbnail preview container, stylized placeholder/loading state, and a clean metadata layout.

## Capabilities

### New Capabilities
- `video-thumbnails`: On-demand server-side thumbnail generation with localized MD5 cache, dynamic visual card rendering, and muted hover-play with browser-compatibility fallbacks.

### Modified Capabilities
- `video-listing`: Expand video-listing requirements to support visual card layouts with lazy-loaded thumbnails alongside the compact text-only layout depending on the environment configuration.

## Impact

- **Backend**: Adds dependencies on `fluent-ffmpeg` and `@ffmpeg-installer/ffmpeg`, a new thumbnail route/controller, and flat local file caching under `src/public/thumbnails/`.
- **Frontend**: Redesigns `.video-item` CSS with conditional `visual` / `compact` card layouts and lazy-loaded images, and injects interactive video elements for hover-play previews.
- **Configuration**: Exposes a new `ENABLE_THUMBNAILS` variable in `.env` to determine backend and frontend modes.
