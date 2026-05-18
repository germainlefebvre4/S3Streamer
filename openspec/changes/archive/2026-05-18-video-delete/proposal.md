## Why

Lorsqu'un utilisateur visionne une vidéo depuis le dialog, il n'a aucun moyen de la supprimer du stockage distant sans quitter l'interface. Ajouter la suppression directement depuis le dialog permet de gérer le catalogue sans friction, notamment pour nettoyer des vidéos indésirables à la volée.

## What Changes

- Ajout d'un bouton "Supprimer" (🗑) dans le header du video-dialog, à côté du bouton fermer
- Au clic sur le bouton, affichage d'une popup de confirmation custom (dans le thème du site) affichant le nom de la vidéo
- En cas de confirmation, appel d'une nouvelle route `DELETE /api/videos/:key` qui supprime l'objet du bucket S3
- Après suppression réussie : retrait de la vidéo du `dialogBuffer`, navigation automatique vers la vidéo suivante (ou précédente si c'était la dernière, ou fermeture du dialog si c'était la seule)
- Retrait immédiat de la card correspondante de la grille visible en arrière-plan
- Invalidation chirurgicale du cache backend : suppression de l'entrée dans `cachedContents` sans refetch S3

## Capabilities

### New Capabilities

- `video-delete` : Suppression d'une vidéo depuis le dialog — bouton dans le header, confirmation custom, appel DELETE backend, navigation post-suppression, mise à jour immédiate de la grille et du cache

### Modified Capabilities

- `video-listing` : Le cache `cachedContents` doit être exposé à la logique de suppression pour permettre l'invalidation chirurgicale

## Impact

- `src/public/index.html` : ajout du bouton supprimer dans le dialog header, ajout de la modal de confirmation, logique post-suppression dans le buffer et la grille
- `src/controllers/videoController.js` : ajout de `deleteVideo` (appel `DeleteObjectCommand`), invalidation du cache
- `src/routes/videoRoutes.js` : ajout de la route `DELETE /api/videos/:key`
- Dépendance AWS SDK : `DeleteObjectCommand` depuis `@aws-sdk/client-s3` (déjà installé)
