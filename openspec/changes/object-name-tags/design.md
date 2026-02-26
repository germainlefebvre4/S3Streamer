## Context

The application lists S3 video objects and already caches the full object list in memory (`cachedContents` in `videoController.js`). Object keys look like `Series/Episode_01_intro_2024.mp4`. The existing search is a simple substring filter on the raw key. There is currently no way to browse by keyword/topic.

## Goals / Non-Goals

**Goals:**
- Extract meaningful words from all S3 object names across the entire (cached) catalogue
- Expose a `/api/videos/tags` endpoint returning `[{ word, count }]` sorted by `count` desc
- Display the tag list at the bottom of the page with counts; clicking a tag triggers the existing search mechanism

**Non-Goals:**
- Stemming, lemmatisation, or multi-language NLP
- Persisting tags to a database
- Tag editing by users
- Filtering the tag list itself

## Decisions

### Tag extraction happens server-side
Rationale: The full object list is already cached server-side. Computing tags there avoids sending all object keys to the browser and keeps the extraction logic testable in isolation.

### Reuse the existing in-memory cache
Tags are derived from `cachedContents` (same data used by `listVideos`). No separate cache is needed; tags are recomputed lazily each time `cachedContents` is refreshed.

### Stopword + exclusion list approach
Tokenisation: split on non-alphanumeric characters (`/[^a-zA-Z0-9]+/`), lowercase, discard tokens that:
- Are fewer than 3 characters
- Match a hardcoded stopword list (EN/FR: `a, an, the, in, on, at, de, du, le, la, les, un, une, et, en, au, aux, par, and, or, of, to, for, is, it, be`)
- Match a date pattern (`/^\d{4}$|^\d{1,2}[-\/]\d{1,2}([-\/]\d{2,4})?$/`)
- Are a known video extension (`mp4, mov, avi, mkv, webm`)
- Are purely numeric

### Count = distinct items, not occurrences
A word appearing twice in one filename is counted once for that item. `count` = number of distinct S3 keys that contain the word.

### Frontend: tag panel is separate from the search input
Tags are fetched once on page load from `/api/videos/tags`. Clicking a tag sets `searchInput.value` and calls `fetchVideos(1)` — no new search mechanism is introduced. The tag panel is rendered below the video grid.

### Tag display: badge list sorted by count desc
Simple inline badges (pill style) with `word (count)` label. No tag cloud scaling — all badges have equal size to keep the UI readable.

## Risks / Trade-offs

- [Risk] Tag list could be large for buckets with many unique words → Mitigation: cap display at top 100 tags
- [Risk] Recomputing tags on every `/api/videos/tags` call hits the cache but is still O(n×k) → Mitigation: acceptable for typical bucket sizes (<10k objects); can memoize alongside cache if needed later
- [Risk] Stopword list is EN-biased → Mitigation: FR stopwords included in initial list; users can open an issue to request additions
