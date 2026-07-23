## 1. Implémentation des Raccourcis Clavier

- [ ] 1.1 Mettre en place les conditions d'isolation (modales inactives, non-saisie de texte) dans l'événement `keydown` global dans `src/public/index.html`.
- [ ] 1.2 Implémenter le raccourci `Space` pour alterner entre Play et Pause sur `videoPlayer` (avec `preventDefault()`).
- [ ] 1.3 Implémenter les raccourcis `ArrowLeft` / `ArrowRight` pour reculer et avancer de 10 secondes (avec `preventDefault()`).
- [ ] 1.4 Implémenter les raccourcis `ArrowUp` / `ArrowDown` pour augmenter et réduire le volume de 10% avec dé-mutage automatique (avec `preventDefault()`).
- [ ] 1.5 Implémenter le raccourci `M` ou `m` pour alterner le mode muet (avec `preventDefault()`).
- [ ] 1.6 Implémenter le raccourci `F` ou `f` pour activer/désactiver le plein écran natif de la balise `<video>` (avec `preventDefault()`).

## 2. Validation et Recette

- [ ] 2.1 Valider le fonctionnement d'Espace (Play/Pause) et l'absence de défilement de page.
- [ ] 2.2 Valider la navigation temporelle (seek ±10s) et s'assurer qu'elle n'interfère pas avec le changement de vidéo (`Ctrl+Flèches`).
- [ ] 2.3 Valider l'ajustement du volume et le mode muet (touche M).
- [ ] 2.4 Valider l'activation et la sortie du mode plein écran (touche F) sur l'élément vidéo.
- [ ] 2.5 Valider que tous les raccourcis sont désactivés lors de la saisie de texte dans la barre de recherche ou si la modale de suppression/config est affichée.
