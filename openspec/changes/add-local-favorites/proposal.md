## Why

Permettre aux utilisateurs de marquer leurs vidéos préférées pour les retrouver rapidement sans avoir à les rechercher manuellement parmi une grande quantité de fichiers sur S3.

## What Changes

- Ajout d'une fonctionnalité de favoris sauvegardés localement dans le navigateur (`localStorage`).
- Intégration d'un bouton de favori (étoile ⭐) sur chaque carte vidéo de la grille principale et dans l'en-tête du lecteur vidéo.
- Ajout d'un bouton filtre dans la barre d'outils pour isoler uniquement les favoris.
- Prise en charge du filtrage côté serveur pour permettre de paginer, chercher et mélanger uniquement les vidéos favorites.

## Capabilities

### New Capabilities
- `local-favorites`: Permet de marquer des vidéos comme favorites, de stocker cette liste localement, de les filtrer et d'interagir avec elles de manière persistante sur le client et le serveur.

### Modified Capabilities

## Impact

- **Frontend** (`src/public/index.html`) : Ajout des icônes d'étoile sur les cartes et dans le dialogue, synchronisation des états, gestion du `localStorage`, et transmission de la liste des favoris à l'API de recherche.
- **Backend** (`src/controllers/videoController.js` et `/api/videos`) : Réception et décodage du paramètre optionnel de requête `favorites` pour restreindre la sélection de vidéos aux clés fournies avant pagination et recherche.
