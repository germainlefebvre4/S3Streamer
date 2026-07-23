## Why

L'utilisation du lecteur vidéo natif du navigateur dans le dialogue de streaming limite l'ergonomie sur ordinateur (PC/Mac). Actuellement, l'utilisateur doit cliquer sur les contrôles natifs de la vidéo pour effectuer des actions courantes. Gérer directement des raccourcis clavier classiques (Espace, Flèches de direction, M, F) lorsque le dialogue est ouvert améliorera considérablement l'expérience utilisateur globale.

## What Changes

- **Nouvelle gestion clavier** : Intercepté directement au niveau du document lorsque le dialogue vidéo est ouvert.
- **Raccourcis ajoutés** :
  - **Espace** : Basculer entre Play et Pause (avec prévention du défilement de la page).
  - **Flèches Gauche / Droite (sans Ctrl)** : Reculer / avancer de 10 secondes dans la lecture de la vidéo.
  - **Flèches Haut / Bas** : Ajuster le volume de +/- 10% (avec désactivation automatique du mode muet lors de l'augmentation du volume).
  - **Touche M (m/M)** : Activer ou désactiver le mode muet (Mute / Unmute).
  - **Touche F (f/F)** : Basculer le mode plein écran natif de l'élément `<video>` (Option A).
- **Protection de la saisie** : Ignorer ces raccourcis si l'utilisateur saisit du texte dans un champ de formulaire ou si des modales de confirmation (comme la suppression) ou de configuration sont au premier plan.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `video-dialog-navigation`: Mise à jour des exigences de navigation et de seek clavier pour clarifier la distinction entre la navigation inter-vidéos (`Ctrl+Arrow`) et le seek/contrôle intra-vidéo géré par nos raccourcis personnalisés (sans `Ctrl`).

## Impact

- **Frontend** : Modification de la gestion de l'événement `keydown` global dans `src/public/index.html`.
- **Compatibilité** : Préservation du comportement natif lorsque le dialogue n'est pas ouvert ou lorsque l'un des raccourcis est utilisé en dehors du contexte d'écoute.
