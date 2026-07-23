## Why

When reusing a single native HTML5 `<video>` element across multiple video playbacks, the browser maintains the `currentTime` of the previously watched video in cache memory. Changing the `src` attribute is synchronous, but media loading is asynchronous. This causes residual `timeupdate` and `pause` events from the old video to fire *after* the internal state pointer has advanced to the new video, erroneously overwriting the new video's progress with the old video's timestamp.

## What Changes

- **Robust State Transition Lock**: Implement a transition locking mechanism (`isTransitioning`). When switching videos, state-saving events (`timeupdate`, `pause`) are explicitly ignored until the new video's `loadedmetadata` event signals that the media engine has fully initialized the new timeline.
- **Explicit Playback Reset**: When opening a video that has no saved progress (or has a progress >= 95%), the video player's `currentTime` is explicitly reset to 0 to prevent position bleeding from the previous video.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `resume-playback`: Explicitly require an async-safe transition mechanism to prevent state leakage between videos, and require resetting `currentTime` to 0 when no valid saved progress is present.

## Impact

- **Frontend (Static HTML)**: Updates the video player's event listeners in `src/public/index.html` to introduce an `isTransitioning` lock and explicitly reset `currentTime` to 0 when appropriate.
- **Frontend (React)**: Updates `frontend/src/components/VideoPlayerDialog.tsx` to implement a matching transition lock, ensuring robust event filtering across both architectures.
