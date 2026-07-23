## Why

S3Streamer currently starts video playback from the beginning (0 seconds) every time a video is loaded or re-opened, and provides no visual indication of viewing progress on the video grid. Storing and resuming the playback position automatically makes the app function as a modern, seamless video streaming platform (similar to Netflix), improving user convenience.

## What Changes

- **Automatic Playback Saving**: The current playback position (`currentTime`) and the video's total duration are stored in local storage at regular intervals and upon user action (e.g., pause, close dialog).
- **Automatic Resume Playback**: When re-opening a previously watched video, playback resumes automatically from the last saved position.
- **Visual Progress Bar**: A thin, glowing progress bar is rendered under each video vignette card in the main grid, visually showing how much of the video has been completed.
- **Auto-clean (Garbage Collection)**: Saved progresses older than 30 days are automatically deleted to keep the storage footprint small and performant.

## Capabilities

### New Capabilities
- `resume-playback`: Storing playback position in localStorage, resuming playback on loaded metadata, displaying progress bars in the video grid, and clearing completion data (at 95% progress) or aged entries.

### Modified Capabilities
None.

## Impact

- **Frontend**: Adds custom local storage logic, video player event listeners (`timeupdate`, `pause`, `loadedmetadata`), and updates `.video-item` grid cards styling to render progress bars under thumbnails.
- **Backend/API**: None (the functionality operates entirely client-side via browser storage).
