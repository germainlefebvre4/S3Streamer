## MODIFIED Requirements

### Requirement: Resume playback position
When a video is opened, the system SHALL check `localStorage` for any saved playback progress associated with the video's S3 key.
If saved progress exists and is less than 95%, the system SHALL automatically set the video player's `currentTime` to the saved position once the video's metadata has loaded.
If no saved progress exists (or if saved progress is 95% or more), the system SHALL explicitly reset the video player's `currentTime` to 0.

#### Scenario: Automatic resume on load
- **WHEN** a video is opened and has a saved progress of 45% in `localStorage`
- **THEN** the system sets the video player's `currentTime` to the saved position as soon as `loadedmetadata` is triggered

#### Scenario: Explicit reset on load
- **WHEN** a video is opened and has no saved progress (or >= 95% progress) in `localStorage`
- **THEN** the system sets the video player's `currentTime` to 0 as soon as `loadedmetadata` is triggered
