## Why

When reusing a single native HTML5 `<video>` element across multiple video playbacks, the browser maintains the `currentTime` of the previously watched video in cache memory. Opening a new video without any saved progress currently inherits this cached position, starting the video from a random, incorrect timestamp instead of from the beginning (0 seconds).

## What Changes

- **Explicit Playback Reset**: When opening a video that has no saved progress (or has a progress >= 95%), the video player's `currentTime` is explicitly reset to 0 to prevent position bleeding from the previous video.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `resume-playback`: Explicitly require resetting `currentTime` to 0 when no valid saved progress is present.

## Impact

- **Frontend (Static HTML)**: Updates the `loadedmetadata` event listener on the video player in `src/public/index.html` to reset `currentTime` to 0 when no saved position is found or if the completion threshold has been reached.
- **Frontend (React)**: No impact needed (already key-isolated), but code remains unified.
