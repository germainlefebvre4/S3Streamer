## 1. Fix Playback Leak & Reset Player State

- [x] 1.1 Update the `loadedmetadata` event listener inside `src/public/index.html` to explicitly reset `currentTime` to 0 when no saved progress exists (or progress >= 95%)
- [x] 1.2 Update the `handleLoadedMetadata` function inside `frontend/src/components/VideoPlayerDialog.tsx` to explicitly reset `currentTime` to 0 when no saved progress exists (or progress >= 95%)

## 2. Robust Transition Lock

- [x] 2.1 Implement `let isTransitioning = false;` logic in `src/public/index.html` around `videoPlayer.src = ...` and clear it on `loadedmetadata` and `closeVideoDialog`. Update event listeners to ignore saves while `isTransitioning` is true.
- [x] 2.2 Implement `const isTransitioningRef = useRef(false);` logic in `frontend/src/components/VideoPlayerDialog.tsx` when the video `key` changes, and release it on `onLoadedMetadata` to safely drop residual `onTimeUpdate` and `onPause` events.
