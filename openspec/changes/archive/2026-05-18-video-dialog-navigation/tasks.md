## 1. Structure HTML du dialog

- [x] 1.1 Ajouter les deux zones de navigation (`<button class="nav-btn nav-prev">` et `<button class="nav-btn nav-next">`) dans le HTML du dialog, avec les icônes SVG chevron
- [x] 1.2 Ajouter le bouton `<button id="dialog-shuffle-btn">🎲 Vidéo au hasard</button>` sous le `.video-container`
- [x] 1.3 Ajouter les styles CSS pour les zones nav pleine hauteur (position absolute, gradient, opacité, hover, disabled)
- [x] 1.4 Ajouter les styles CSS pour le bouton 🎲 (discret au repos, actif en mode shuffle, état disabled)

## 2. État du buffer de navigation

- [x] 2.1 Déclarer les variables d'état du dialog : `dialogBuffer`, `dialogAbsoluteIndex`, `dialogContext` (searchQuery, shuffleMode, pageSize, totalPages, currentLoadedPage)
- [x] 2.2 Modifier `openVideoDialog(video, index, videos, totalPages, loadedPage)` pour initialiser le buffer avec la liste courante et capturer le contexte
- [x] 2.3 Modifier tous les appels à `openVideoDialog` dans `fetchVideos` pour passer la vidéo, son index, la liste complète de la page, et les métadonnées de pagination
- [x] 2.4 Réinitialiser le buffer et l'état à la fermeture du dialog (`closeVideoDialog`)

## 3. Logique de navigation

- [x] 3.1 Implémenter `navigateDialog(direction)` : avance ou recule `dialogAbsoluteIndex`, appelle `playVideoAtIndex()`
- [x] 3.2 Implémenter `playVideoAtIndex(index)` : met à jour `videoPlayer.src`, `videoDialogTitle`, et l'état des boutons nav
- [x] 3.3 Implémenter `updateNavButtons()` : active/désactive les zones gauche et droite selon la position et `totalPages`
- [x] 3.4 Implémenter le chargement de la page suivante dans `navigateDialog` : si `dialogAbsoluteIndex === dialogBuffer.length - 1` et page suivante disponible, fetcher et appender au buffer avant de naviguer
- [x] 3.5 Gérer l'état de chargement en cours (`isLoadingPage`) pour bloquer les clics doubles et afficher l'indicateur sur le bouton

## 4. Navigation clavier

- [x] 4.1 Modifier l'écouteur `keydown` existant : intercepter `Ctrl+ArrowRight` et `Ctrl+ArrowLeft` quand le dialog est ouvert, appeler `navigateDialog`, et `preventDefault()`
- [x] 4.2 Vérifier que `ArrowLeft` / `ArrowRight` sans `Ctrl` ne déclenchent pas la navigation (comportement natif du player préservé)

## 5. Bouton 🎲 Vidéo au hasard

- [x] 5.1 Implémenter l'écouteur du bouton 🎲 : vider le buffer, fetcher `/api/videos?shuffle=true&pageSize=...`, initialiser le buffer avec les nouvelles vidéos, jouer la première
- [x] 5.2 Activer/désactiver le bouton 🎲 selon `shuffleMode` à l'ouverture du dialog et au changement d'état shuffle (via `updateShuffleBtn()`)

## 6. Tests manuels

- [ ] 6.1 Vérifier la navigation ← → sur une page avec plusieurs vidéos (bords désactivés correctement)
- [ ] 6.2 Vérifier le chargement cross-page : naviguer jusqu'au bout d'une page et passer à la suivante
- [ ] 6.3 Vérifier `Ctrl+←` / `Ctrl+→` depuis le clavier, et que `←` / `→` seuls font le seek natif
- [ ] 6.4 Vérifier le bouton 🎲 en mode shuffle : re-roll et affichage de la première vidéo du nouveau tirage
- [ ] 6.5 Vérifier que le bouton 🎲 est visible mais désactivé hors mode shuffle
- [ ] 6.6 Vérifier que la grille reste inchangée pendant la navigation dans le dialog
