## Purpose

Expose tag extraction from S3 object names via a dedicated API endpoint and surface those tags as an interactive UI panel, allowing users to discover and filter content by keywords derived from object keys.

## Requirements

### Requirement: Tag extraction from S3 object names
The system SHALL expose a `GET /api/videos/tags` endpoint that extracts words from all S3 object keys in the cached catalogue, filters out stopwords, dates, file extensions, and tokens shorter than 3 characters, and returns a sorted list of `{ word, count }` objects where `count` is the number of distinct items whose key contains that word. The list SHALL be sorted by `count` descending. The response SHALL be capped at the top 100 tags.

#### Scenario: Tags derived from object names
- **WHEN** the S3 bucket contains objects with keys like `Series_A/Episode_01_intro_2024.mp4` and `Series_A/Episode_02_recap.mp4`
- **THEN** the endpoint returns tags including `{ word: "series", count: 2 }`, `{ word: "episode", count: 2 }`, `{ word: "intro", count: 1 }`, `{ word: "recap", count: 1 }`
- **THEN** `"2024"` (date-like), `"mp4"` (extension), `"a"` (too short / stopword) are NOT included

#### Scenario: A word appearing multiple times in one filename counts once
- **WHEN** a single object key is `action_action_movie.mp4`
- **THEN** `{ word: "action", count: 1 }` (not 2)

#### Scenario: Stopwords are excluded
- **WHEN** object keys contain tokens matching the stopword list (e.g., `"and"`, `"the"`, `"de"`, `"les"`)
- **THEN** those tokens do not appear in the tag list

#### Scenario: Tokens shorter than 3 characters are excluded
- **WHEN** a token extracted from an object name has fewer than 3 characters (e.g., `"ok"`, `"a"`, `"01"`)
- **THEN** it does not appear in the tag list

#### Scenario: Purely numeric tokens are excluded
- **WHEN** a token consists entirely of digits (e.g., `"2024"`, `"01"`, `"1080"`)
- **THEN** it does not appear in the tag list

#### Scenario: Result is sorted by count descending
- **WHEN** multiple tags are returned
- **THEN** tags are ordered from highest `count` to lowest

#### Scenario: Response is capped at 100 tags
- **WHEN** more than 100 distinct words pass the filters
- **THEN** only the top 100 (by count) are returned

### Requirement: Tag panel displayed below the video grid
The UI SHALL display a tag panel below the video grid containing all tags returned by `/api/videos/tags`. Each tag SHALL show its word and item-count. Tags SHALL be rendered as clickable pill badges sorted by count descending (matching the API order). The panel SHALL have a visible section title.

#### Scenario: Tag panel loads on page startup
- **WHEN** the page finishes loading
- **THEN** the tag panel is populated with tags from `/api/videos/tags`
- **THEN** each badge displays the word and its count (e.g., `action (12)`)

#### Scenario: Clicking a tag filters the video list
- **WHEN** the user clicks a tag badge
- **THEN** the search input value is set to that tag's word
- **THEN** the video list is refreshed from page 1 with the tag word as the search query
- **THEN** the URL is updated to reflect the new search parameter

#### Scenario: Tag panel is empty when no tags are returned
- **WHEN** the API returns an empty tag list (e.g., all tokens are stopwords or the bucket is empty)
- **THEN** the tag panel is hidden or displays a neutral placeholder message
