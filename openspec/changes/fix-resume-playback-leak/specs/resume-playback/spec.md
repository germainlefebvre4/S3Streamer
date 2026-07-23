## MODIFIED Requirements

### Requirement: Resume playback position
When a video is opened, the system SHALL implement an asynchronous state transition lock that ignores progress saving events (`timeupdate`, `pause`) until the new video's metadata is fully loaded.
When a video is opened, the system SHALL check `localStorage` for any saved playback progress associated with the video's S3 key.
If saved progress exists and is less than 95%, the system SHALL automatically set the video player's `currentTime` to the saved position once the video's metadata has loaded.
If no saved progress exists (or if saved progress is 95% or more), the system SHALL explicitly reset the video player's `currentTime` to 0.

#### Scenario: Ignore residual events during load
- **WHEN** a new video is requested and the browser fires residual `timeupdate` events from the previous video
- **THEN** the system ignores these events and does not overwrite the new video's progress

#### Scenario: Automatic resume on load
- **WHEN** a video is opened and has a saved progress of 45% in `localStorage`
- **THEN** the system sets the video player's `currentTime` to the saved position as soon as `loadedmetadata` is triggered

#### Scenario: Explicit reset on load
- **WHEN** a video is opened and has no saved progress (or >= 95% progress) in `localStorage`
- **THEN** the system sets the video player's `currentTime` to 0 as soon as `loadedmetadata` is triggered
