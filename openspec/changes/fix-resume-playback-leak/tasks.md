## 1. Fix Playback Leak & Reset Player State

- [x] 1.1 Update the `loadedmetadata` event listener inside `src/public/index.html` to explicitly reset `currentTime` to 0 when no saved progress exists (or progress >= 95%)
- [x] 1.2 Update the `handleLoadedMetadata` function inside `frontend/src/components/VideoPlayerDialog.tsx` to explicitly reset `currentTime` to 0 when no saved progress exists (or progress >= 95%)
