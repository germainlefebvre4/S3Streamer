## 1. Backend Integration & Configuration

- [ ] 1.1 Add `fluent-ffmpeg` and `@ffmpeg-installer/ffmpeg` as dependencies in `package.json`
- [ ] 1.2 Support the `ENABLE_THUMBNAILS` environment variable in `src/controllers/videoController.js` and expose `config.thumbnailsEnabled` in the `/api/videos` list response
- [ ] 1.3 Implement startup routine to ensure `src/public/thumbnails/` exists and append `/src/public/thumbnails/*` to `.gitignore` to prevent caching binaries or JPEGs in git

## 2. On-Demand Thumbnail Generation Endpoint

- [ ] 2.1 Register the `/api/videos/thumbnail/:key` route in `src/routes/videoRoutes.js`
- [ ] 2.2 Implement the concurrent-safe `getThumbnail` controller in `src/controllers/videoController.js` using MD5 flat hashing, S3 presigned-URL streaming, and a map-based active generations Promise tracker to prevent duplicate FFmpeg spawns
- [ ] 2.3 Handle the 403 Forbidden response in the controller when `ENABLE_THUMBNAILS` is disabled, preventing unauthorized generation

## 3. Frontend Adaptations & Modern Video Cards

- [ ] 3.1 Add the `.visual` and `.compact` responsive card structures and layout styles to `src/public/index.html` CSS
- [ ] 3.2 Define styles for `.video-thumbnail-container`, `.video-thumbnail`, `.video-thumbnail-placeholder`, and `.video-hover-preview` inside the stylesheet in `index.html`
- [ ] 3.3 Update `fetchVideos` in `index.html` to build the new visual grid layout with lazy-loaded image tags when thumbnails are enabled, or the legacy text layout when disabled

## 4. Interactive Hover Play Logic

- [ ] 4.1 Implement the `mouseenter` 400ms debounced event listener on the video card thumbnail container to dynamically inject and play a muted, loopable, inline-playing `<video>` starting at `currentTime = 2`
- [ ] 4.2 Implement the `mouseleave` cleanup event listener to immediately pause, remove, and garbage collect the video player to free client system and network resources
- [ ] 4.3 Add a format checking fallback using the S3 key file extension, ensuring that non-browser-native formats (like `.avi`) bypass hover playback and preserve the static server-generated JPEG thumbnail
