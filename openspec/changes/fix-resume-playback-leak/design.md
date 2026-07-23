## Context

During video playback, if a single `<video>` DOM element is recycled or reused (which is the case in the static HTML frontend of S3Streamer), changing its `src` attribute is a synchronous javascript operation, but the internal media loading and decoder initialization are asynchronous. As the browser unloads the old video and loads the new one, it can fire residual `timeupdate` and `pause` events. Because the Javascript state pointer (e.g. `dialogAbsoluteIndex`) has already advanced to the new video, these residual events from the old video's timeline accidentally overwrite the saved progress of the new video.

## Goals / Non-Goals

**Goals:**
- Guarantee that when switching or opening a video with no saved progress, playback starts from the absolute beginning (0 seconds).
- Completely isolate state-saving events between videos using a robust transition lock.
- Keep the code pattern consistent between the React app and the raw HTML implementation.

**Non-Goals:**
- Completely rewriting the HTML player's architecture or navigation flow.

## Decisions

### Decision 1: `isTransitioning` Lock Pattern
- **Rationale**: By introducing a boolean lock (`isTransitioning = true`) just before changing the `src` attribute, and only releasing the lock (`isTransitioning = false`) inside the `loadedmetadata` event of the new video, we can safely ignore any residual `timeupdate` or `pause` events fired by the browser engine during the tear-down of the previous media stream.
- **Alternatives Considered**: Debouncing events, checking if the event target's src matches the active video string. Discarded because `isTransitioning` is simpler and 100% deterministic regarding the asynchronous engine state.

### Decision 2: Explicit Reset in `loadedmetadata`
- **Rationale**: Resetting `currentTime` to `0` inside the `loadedmetadata` event listener when there is no saved progress in local storage (or if progress has reached 95%) is the most reliable, cross-browser compatible method. It is lightweight, direct, and avoids introducing complex timing states or race conditions.
- **Alternatives Considered**: Resetting `currentTime` inside the `closeVideoDialog` or navigation buttons handlers. Discarded because if the video load takes time, the browser might override the reset value when the metadata actually loads.

## Risks / Trade-offs

- **[Risk] Playback stuttering during loading** → *Mitigation*: Setting `currentTime = 0` only after the metadata is fully loaded in the `loadedmetadata` callback ensures that the video's timeline is fully initialized by the browser before the reset occurs.
- **[Risk] Transition lock deadlock** → *Mitigation*: Ensure the lock is cleared upon dialog close or unmount so it doesn't permanently block updates.
