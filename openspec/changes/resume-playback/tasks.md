## 1. Playback Tracking Logic & Garbage Collection

- [x] 1.1 Implement the `PlaybackTracker` javascript helper module in `src/public/index.html` to load, save, and retrieve playback metadata
- [x] 1.2 Implement the automatic 30-day garbage collection routine and trigger it on application load

## 2. Video Player Events & State Integration

- [x] 2.1 Add the `loadedmetadata` event listener to the video player in `index.html` to resume playback from the saved position
- [x] 2.2 Add the throttled `timeupdate` listener to save progress every 5 seconds during continuous playback
- [x] 2.3 Add immediate saving on video `pause` and when closing the video dialog
- [x] 2.4 Handle video completion (>= 95% or `ended` event) by clearing progress data for that video

## 3. UI Implementation & Dynamic Progress Synchronization

- [x] 3.1 Add the `.video-progress-container` and `.video-progress-fill` glowing emerald CSS styles to the inline stylesheet in `index.html`
- [x] 3.2 Update the grid rendering loop inside `fetchVideos` to render the progress bar under thumbnails on load
- [x] 3.3 Implement `updateCardProgress` to dynamically update the progress bar on the main grid in real-time as the video plays
