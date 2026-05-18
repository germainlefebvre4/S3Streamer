## Why

Lorsqu'un utilisateur ouvre une vidéo depuis la grille, il doit fermer le dialog et cliquer sur une autre card pour passer à la vidéo suivante. Cette friction interrompt la fluidité de la navigation et rend l'exploration du catalogue fastidieuse.

## What Changes

- Ajout de zones de navigation gauche/droite (style Netflix) dans le dialog vidéo, permettant de passer d'une vidéo à l'autre sans quitter le layer
- Navigation transparente entre les pages : quand l'utilisateur atteint la fin de la page courante, la page suivante est chargée automatiquement en fond
- Le dialog maintient son propre buffer de vidéos (indépendant de la grille) construit à partir du contexte de la liste au moment de l'ouverture (recherche active, mode shuffle)
- Navigation clavier : `Ctrl+←` / `Ctrl+→` pour passer d'une vidéo à l'autre ; `←` / `→` reste réservé au seek dans la vidéo ; `Escape` ferme le dialog
- Ajout d'un bouton "🎲 Vidéo au hasard" visible en permanence dans le dialog (actif uniquement en mode shuffle), positionné sous le player
- En mode shuffle, les flèches naviguent dans l'ordre aléatoire affiché (buffer stable) ; le bouton 🎲 déclenche un re-roll complet et remplace le buffer

## Capabilities

### New Capabilities

- `video-dialog-navigation` : Navigation entre vidéos au sein du dialog — zones cliquables gauche/droite, buffer cross-page, gestion keyboard, bouton shuffle

### Modified Capabilities

- `random-shuffle` : Ajout du comportement du bouton 🎲 dans le dialog (re-roll du buffer, visibilité permanente mais activation conditionnelle)

## Impact

- `src/public/index.html` : refactoring de `openVideoDialog`, ajout du buffer de navigation, nouveaux éléments HTML pour les boutons nav et le bouton shuffle
- Aucun changement d'API backend
- Aucune nouvelle dépendance
