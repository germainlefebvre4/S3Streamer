## 1. Backend API Support

- [ ] 1.1 Support parsing the optional query parameter `favorites` (JSON-encoded array of keys) in the GET `/api/videos` endpoint inside `src/controllers/videoController.js`
- [ ] 1.2 Apply filtering on the video list to match S3 Keys with the parsed favorites array before pagination, search, and random shuffle inside `src/controllers/videoController.js`

## 2. Frontend Styling and UI elements

- [ ] 2.1 Add CSS styling for the card favorite button (`.favorite-card-btn`), with appropriate states for active/inactive stars, and ensure `.video-item` has `position: relative` in `src/public/index.html`
- [ ] 2.2 Add the favorites filter button (`#fav-filter-btn`) to the toolbar layout in `src/public/index.html`
- [ ] 2.3 Add the favorite button (`#favorite-dialog-btn`) next to the delete button in the video dialog header layout in `src/public/index.html`

## 3. Frontend Core Logic and Favorites Management

- [ ] 3.1 Initialize the favorites Set in frontend memory by loading from `localStorage.getItem('s3streamer_favorites')` in `src/public/index.html`
- [ ] 3.2 Update `fetchVideos` to include the `favorites` query parameter when the favorites filter is active, sending the JSON-serialized array of favorited keys in `src/public/index.html`
- [ ] 3.3 Render the star button (⭐ or ☆) on each video-item card, adding click event listeners that toggle the favorite state, save to `localStorage`, and call `event.stopPropagation()` in `src/public/index.html`
- [ ] 3.4 Integrate the favorite button inside the video player dialog, making sure its visual state is updated when a video is played or when clicked, and that the under-the-dialog card's star state is updated in real time in `src/public/index.html`
- [ ] 3.5 Add click event listener on the toolbar's favorites filter button to toggle active state, update UI style (active green class), reset page to 1, and fetch videos in `src/public/index.html`
- [ ] 3.6 Handle empty favorites case: when the favorites filter is active and the list is empty, display a friendly placeholder message: "Vous n'avez pas encore de favoris. Cliquez sur ⭐ pour en ajouter." in `src/public/index.html`

## 4. Verification and Validation

- [ ] 4.1 Verify adding/removing favorites from both cards and the video player works perfectly and is preserved across page reloads
- [ ] 4.2 Verify the "Favorites" toolbar filter displays only favorited videos and handles pagination, search, and random shuffle correctly within the favorited subset
- [ ] 4.3 Verify that unfavoriting a card in filtered mode updates the star to ☆ but keeps the card in view (Option B), and that it is removed on next page load or filter toggle
