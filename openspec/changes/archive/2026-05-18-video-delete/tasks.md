## 1. Backend — Route et contrôleur de suppression

- [x] 1.1 Importer `DeleteObjectCommand` depuis `@aws-sdk/client-s3` dans `videoController.js`
- [x] 1.2 Implémenter la fonction `deleteVideo` : décoder la clé, appeler `DeleteObjectCommand`, invalider chirurgicalement `cachedContents` (retirer l'entrée par `Key`)
- [x] 1.3 Exporter `deleteVideo` depuis `videoController.js`
- [x] 1.4 Ajouter la route `DELETE /api/videos/:key` dans `videoRoutes.js` en utilisant `deleteVideo`

## 2. Frontend — Bouton de suppression dans le dialog header

- [x] 2.1 Ajouter un bouton `🗑` dans `.video-dialog-header`, entre le titre et le bouton fermer (`×`)
- [x] 2.2 Styler le bouton (transparent, couleur danger au hover, cohérent avec le bouton fermer)
- [x] 2.3 Référencer le bouton dans les variables JS au chargement du DOM

## 3. Frontend — Modal de confirmation

- [x] 3.1 Ajouter le HTML de la modal de confirmation (overlay + contenu : message avec nom du fichier, bouton Confirmer, bouton Annuler)
- [x] 3.2 Styler la modal (réutiliser le pattern `.config-modal-overlay` existant, bouton confirmer en rouge danger)
- [x] 3.3 Implémenter `openDeleteModal(videoKey)` : remplir le message avec le nom du fichier, afficher l'overlay
- [x] 3.4 Implémenter `closeDeleteModal()` : masquer l'overlay
- [x] 3.5 Brancher Annuler et clic sur l'overlay sur `closeDeleteModal()`
- [x] 3.6 Gérer la touche Escape pour fermer la modal de confirmation (intégrer dans le listener keydown existant)

## 4. Frontend — Logique de suppression et navigation post-delete

- [x] 4.1 Implémenter `deleteCurrentVideo()` : appeler `DELETE /api/videos/:key`, gérer erreur (afficher message), déclencher la navigation post-suppression
- [x] 4.2 Implémenter la navigation post-suppression : retirer la vidéo de `dialogBuffer`, naviguer vers la suivante, puis la précédente, sinon fermer le dialog
- [x] 4.3 Retirer immédiatement la card DOM correspondante de la grille (trouver la card par `video.key`, la supprimer du DOM)
- [x] 4.4 Brancher le bouton 🗑 sur `openDeleteModal`, et le bouton Confirmer sur `deleteCurrentVideo`
