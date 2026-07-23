## Why

L'application S3Streamer permet de lister les vidéos d'un bucket S3. Actuellement, la liste est présentée uniquement par ordre alphabétique par défaut (tri lexicographique d'Amazon S3) ou dans un ordre purement aléatoire (mode shuffle). Cette proposition vise à enrichir l'expérience utilisateur en fournissant des options de tri avancées (date de modification, taille de fichier, ordre alphabétique inverse) directement depuis l'interface de la grille, facilitant la découverte des nouveaux contenus et l'exploration du catalogue.

## What Changes

- Ajout d'un sélecteur de tri (`<select>`) dans la toolbar principale, placé à côté du champ de recherche.
- Prise en charge de quatre options de tri :
  - **Nom (A-Z)** : Ordre alphabétique normal (comportement par défaut).
  - **Alphabétique inverse** : Ordre alphabétique inversé (Z-A).
  - **Date de modification (plus récent)** : Permet d'afficher les nouveaux ajouts en premier.
  - **Taille du fichier** : Permet de trier par la taille du fichier (du plus grand au plus petit).
- Intégration du tri côté backend sur l'API `GET /api/videos` via un paramètre de requête `sort`.
- Désactivation automatique et états visuels clairs lors de l'activation du mode aléatoire (shuffle).
- Persistance de l'état de tri dans l'URL (paramètre `sort`) et synchronisation de la navigation interne des vidéos dans le lecteur dialog.

## Capabilities

### New Capabilities
- `video-sorting`: Fournit des fonctionnalités de tri côté backend et interface utilisateur pour ordonner la liste des vidéos selon différents critères (nom, date, taille).

### Modified Capabilities
- `video-listing`: L'API de listing des vidéos prend désormais en charge un paramètre optionnel `sort` pour ordonner les résultats avant la pagination.

## Impact

- **Backend** : Contrôleur `src/controllers/videoController.js` mis à jour pour accepter `sort` et appliquer le tri sur la liste filtrée.
- **Frontend** : Fichier `src/public/index.html` mis à jour pour ajouter le sélecteur HTML, gérer l'état `currentSort`, l'injecter dans les requêtes de pagination (y compris les fetches automatiques de page suivante du dialogue), et synchroniser les URL.
- **Dépendances** : Aucune nouvelle dépendance.
