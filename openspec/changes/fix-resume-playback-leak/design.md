## Context

During video playback, if a single `<video>` DOM element is recycled or reused (which is the case in the static HTML frontend of S3Streamer), changing its `src` attribute does not automatically reset its internal `currentTime` state instantly. If the newly loaded video does not have any saved playback progress, the browser continues playing the video from the previous video's last recorded timestamp, creating a state leak across different files.

## Goals / Non-Goals

**Goals:**
- Guarantee that when switching or opening a video with no saved progress, playback starts from the absolute beginning (0 seconds).
- Do not affect React/key-isolated players (already naturally isolated, but keep the code pattern consistent).

**Non-Goals:**
- Completely rewriting the HTML player's architecture or navigation flow.

## Decisions

### Decision: Explicit Reset in `loadedmetadata`
- **Rationale**: Resetting `currentTime` to `0` inside the `loadedmetadata` event listener when there is no saved progress in local storage (or if progress has reached 95%) is the most reliable, cross-browser compatible method. It is lightweight, direct, and avoids introducing complex timing states or race conditions.
- **Alternatives Considered**: Resetting `currentTime` inside the `closeVideoDialog` or navigation buttons handlers. Discarded because if the video load takes time, the browser might override the reset value when the metadata actually loads.

## Risks / Trade-offs

- **[Risk] Playback stuttering during loading** → *Mitigation*: Setting `currentTime = 0` only after the metadata is fully loaded in the `loadedmetadata` callback ensures that the video's timeline is fully initialized by the browser before the reset occurs.
