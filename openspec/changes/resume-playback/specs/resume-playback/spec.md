## ADDED Requirements

### Requirement: Store playback progress
The system SHALL store the `currentTime` and total `duration` of the currently playing video in `localStorage` under a unified key `s3streamer_playback_progress`, mapped by the video's relative S3 key.
The system SHALL throttle updates to once every 5 seconds during continuous playback.
The system SHALL perform an immediate save of playback progress when the video is paused or when the video dialog is closed.
If the video playback progress reaches 95% or more of the total duration, or if the video ends, the system SHALL clear the stored playback progress for that video.

#### Scenario: Periodic saving of progress
- **WHEN** a video is playing continuously for more than 5 seconds
- **THEN** the system updates the saved `currentTime` and `duration` in `localStorage` for that video's key

#### Scenario: Immediate saving on pause
- **WHEN** a playing video is paused
- **THEN** the system immediately updates the saved position in `localStorage` without waiting for the 5-second interval

#### Scenario: Reset progress when video is completed
- **WHEN** a video reaches 95% or more of its total duration, or triggers the `ended` event
- **THEN** the system removes that video's progress entry from `localStorage`

### Requirement: Resume playback position
When a video is opened, the system SHALL check `localStorage` for any saved playback progress associated with the video's S3 key.
If saved progress exists and is less than 95%, the system SHALL automatically set the video player's `currentTime` to the saved position once the video's metadata has loaded.

#### Scenario: Automatic resume on load
- **WHEN** a video is opened and has a saved progress of 45% in `localStorage`
- **THEN** the system sets the video player's `currentTime` to the saved position as soon as `loadedmetadata` is triggered

### Requirement: Display visual progress bar
The system SHALL display a thin progress bar under each video card's thumbnail in the main grid for any video that has a saved playback progress in `localStorage` of less than 95%.
The progress bar width SHALL represent the percentage of completion (`currentTime` / `duration` * 100).
The progress bar color SHALL be Emerald to match the modern styling, featuring a subtle glowing shadow effect.
The system SHALL update the progress bar width dynamically in real-time when the video's progress is saved, so that closing the player shows the updated progress immediately.

#### Scenario: Renders progress bar on grid
- **WHEN** the main grid is loaded
- **THEN** cards with saved progress in `localStorage` display a glowing Emerald progress bar at the bottom, representing their exact completion percentage

### Requirement: Cleanup old progress entries
Upon application initialization, the system SHALL inspect all saved progress entries in `localStorage` and delete any entry whose `updatedAt` timestamp is older than 30 days.

#### Scenario: Automatic garbage collection
- **WHEN** the application starts
- **THEN** progress entries older than 30 days are removed from `localStorage`
