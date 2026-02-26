## Why

Parcourir un grand catalogue de vidéos page par page ne favorise pas la découverte. Un mode aléatoire permet d'afficher une sélection tirée au sort parmi toutes les vidéos disponibles, sans avoir à naviguer manuellement.

## What Changes

- Un bouton 🔀 est ajouté dans la toolbar pour activer/désactiver le mode aléatoire.
- En mode aléatoire, la pagination est masquée et le backend renvoie `pageSize` vidéos tirées aléatoirement parmi le catalogue filtré.
- Un bouton "Nouveau tirage" permet de relancer un tirage sans quitter le mode aléatoire.
- Lorsque le mode aléatoire est désactivé, la pagination et le comportement normal sont restaurés.
- Le mode aléatoire est compatible avec le filtre `search` : le tirage s'effectue parmi les vidéos correspondant à la recherche active.

## Capabilities

### New Capabilities
- `random-shuffle` : Mode d'affichage aléatoire — activation via la toolbar, tirage backend d'un sous-ensemble de `pageSize` vidéos, désactivation de la pagination.

### Modified Capabilities
<!-- Aucune : le contrat d'API existant est étendu d'un paramètre optionnel, comportement inchangé si absent. -->

## Impact

- `src/controllers/videoController.js` : nouveau paramètre `shuffle=true` → sélection aléatoire de `pageSize` éléments parmi la liste filtrée, `totalPages` renvoyé à 1.
- `src/public/index.html` : bouton 🔀 dans la toolbar, état `shuffleMode` en mémoire, masquage de la pagination en mode shuffle, bouton "Nouveau tirage".
- Aucune nouvelle dépendance.
