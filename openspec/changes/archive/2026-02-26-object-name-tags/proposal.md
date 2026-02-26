## Why

Navigating a large S3 bucket by filename alone is tedious. Extracting recurring words from object names and surfacing them as clickable tags lets users quickly filter content by topic, series, or keyword without typing.

## What Changes

- Add server-side tag extraction logic: tokenize all S3 object names, filter out stopwords, dates, and file extensions, count how many distinct items contain each word
- Add a new `/api/videos/tags` API endpoint returning the sorted tag list
- Add a tag panel at the bottom of the page displaying tags sorted by descending item-count, with the count shown beside each tag
- Clicking a tag applies it as a search filter (same mechanism as the existing search input)

## Capabilities

### New Capabilities
- `object-name-tags`: Extract tags from S3 object names and display them sorted by frequency at the bottom of the page; clicking a tag filters the video list

### Modified Capabilities

## Impact

- `src/controllers/videoController.js`: new `listTags` export function + registration in router
- `src/public/index.html`: new tag panel section (CSS + HTML + JS)
- `src/routes/` (or equivalent router file): new GET `/api/videos/tags` route
