## 1. Backend – Tag Extraction

- [ ] 1.1 Add `extractTags(contents)` pure function in `videoController.js`: tokenise each key on non-alphanumeric chars, lowercase, deduplicate per item, filter stopwords / dates / extensions / short / numeric tokens
- [ ] 1.2 Export `listTags` async handler: read from `cachedContents` (refreshing if stale), call `extractTags`, sort by count desc, cap at 100, return `{ tags: [{ word, count }] }`
- [ ] 1.3 Register `GET /api/videos/tags` route in `src/routes/videoRoutes.js`

## 2. Frontend – Tag Panel UI

- [ ] 2.1 Add CSS styles for `.tags-section` container and `.tag-badge` pill (word + count, hover highlight)
- [ ] 2.2 Add `<div id="tags-section">` HTML block below the `#video-list` div with a section title
- [ ] 2.3 Add `fetchTags()` JS function: call `/api/videos/tags`, render badges into `#tags-section`; hide section if list is empty
- [ ] 2.4 Wire badge click: set `searchInput.value = word`, call `fetchVideos(1)`, update URL

## 3. Initialisation

- [ ] 3.1 Call `fetchTags()` once during `DOMContentLoaded` after initial `fetchVideos()` call
