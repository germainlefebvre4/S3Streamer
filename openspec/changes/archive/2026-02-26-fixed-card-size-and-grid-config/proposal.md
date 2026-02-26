## Why

Les cards vidéo ont une hauteur variable selon la longueur du nom de fichier, ce qui rend la grille visuellement instable. Par ailleurs, la densité de la grille (nombre de colonnes et de lignes par page) est figée à 18 éléments sans possibilité de réglage, ce qui ne convient pas à tous les écrans ou usages.

## What Changes

- Les cards affichent une hauteur fixe : le nom de fichier est tronqué avec ellipsis si trop long, les métadonnées restent alignées en bas de la card.
- Un bouton de configuration (⚙) ouvre une modale dédiée permettant de choisir le nombre de colonnes et de lignes affichées par page.
- Le `pageSize` envoyé à l'API est calculé dynamiquement à partir de `colonnes × lignes`.
- La configuration est persistée dans `localStorage` et chargée au démarrage.
- La grille CSS reflète le nombre de colonnes configuré.

## Capabilities

### New Capabilities
- `grid-config` : Modale de configuration du nombre de colonnes et de lignes, avec persistance localStorage et application immédiate à la grille et à la pagination.

### Modified Capabilities
- `video-listing` : Les cards ont une hauteur fixe avec troncature du nom ; le nombre de colonnes CSS et le `pageSize` sont pilotés par la configuration de la grille.

## Impact

- `src/public/index.html` : modification CSS (card height, grid columns), ajout HTML (bouton config + modale), modification JS (lecture localStorage, passage de `pageSize` à l'API, application des colonnes).
- `src/controllers/videoController.js` : aucun changement — le paramètre `pageSize` est déjà supporté.
- Aucune nouvelle dépendance.
