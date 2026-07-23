## Context

Actuellement, l'application S3Streamer liste les vidéos d'un bucket Amazon S3 en s'appuyant sur un cache en mémoire `cachedContents` expirable (TTL). La pagination est gérée par le serveur Node.js (Express), tandis que l'interface (Single Page Application HTML/JS) effectue des appels paginés vers l'API `/api/videos`.
Afin de trier l'intégralité du catalogue, le tri doit impérativement s'exécuter côté backend sur l'ensemble de la liste filtrée avant de tronquer les éléments pour la pagination. Les critères de tri requis sont : alphabétique, alphabétique inverse, date de modification de l'objet S3 et taille de l'objet S3.

## Goals / Non-Goals

**Goals:**
- Implémenter le tri côté serveur en triant la liste totale filtrée avant la pagination.
- Ajouter un élément d'interface utilisateur `<select>` pour choisir le critère de tri, réactif et synchronisé avec l'état de l'application et l'URL.
- Gérer l'exclusivité mutuelle entre le tri et le mode shuffle (aléatoire).
- Assurer la cohérence du tri lors de la navigation latérale et du préchargement cross-page dans le dialogue de visionnage.

**Non-Goals:**
- Mettre en œuvre un tri multi-critères complexe ou personnalisé.
- Trier individuellement les dossiers ou sous-dossiers S3 (le tri s'applique globalement à l'ensemble des vidéos du catalogue après filtrage).

## Decisions

### Décision 1 : Tri côté Backend (Plutôt que Frontend)
- **Option A** : Trier côté Frontend sur la page affichée.
  - *Inconvénient* : Le tri ne s'appliquerait qu'aux 18 vidéos de la page courante au lieu de réordonner l'ensemble des vidéos du bucket S3 (ex: trier par date ne remonterait pas la vidéo la plus récente de tout le bucket s'il y a 50 pages).
- **Option B** : Récupérer tout le catalogue côté Frontend et trier en local.
  - *Inconvénient* : Brise le principe de pagination de l'API et alourdirait considérablement la bande passante si le catalogue contient des milliers d'objets.
- **Option C** : Trier côté Backend sur `filteredVideos` avant le découpage `slice`. (Retenue)
  - *Rationale* : Solution performante et correcte. Le backend possède déjà la liste complète des objets S3 en cache (`cachedContents`). Le tri s'effectue en mémoire ultra-rapidement, et la pagination reste parfaitement cohérente.

### Décision 2 : Architecture de l'API (`sort` query parameter)
Le paramètre `sort` sera transmis à `GET /api/videos` :
- `name_asc` : Trie par clé S3 de manière ascendante (comportement d'origine, s'appuie sur `localeCompare`).
- `name_desc` : Trie par clé S3 de manière descendante.
- `date_desc` : Trie par date `LastModified` descendante. Les valeurs `LastModified` fournies par l'AWS SDK sont des objets `Date`, convertis en millisecondes pour un tri stable.
- `size_desc` : Trie par taille de fichier `Size` décroissante.

### Décision 3 : Interactions Shuffle / Tri
- Le mode aléatoire (shuffle) passe outre le tri.
- Pour simplifier l'UI et éviter les états incohérents, l'activation du mode aléatoire grise le menu de tri. À l'inverse, si l'utilisateur sélectionne un critère de tri, cela désactive automatiquement le mode aléatoire.

## Risks / Trade-offs

- **[Risk] S3 Objects sans propriétés** → Si certains objets S3 retournés n'ont pas de `LastModified` ou de `Size`, le tri pourrait planter ou être instable.
  - *Mitigation* : Utiliser des valeurs de secours (ex: `a.LastModified ? new Date(a.LastModified).getTime() : 0` et `a.Size || 0`) dans la fonction de comparaison.
- **[Risk] Tri lexicographique vs Tri naturel** → Un fichier `10.mp4` peut se retrouver avant `2.mp4` en tri lexicographique standard.
  - *Mitigation* : Nous utiliserons `localeCompare(..., undefined, { numeric: true, sensitivity: 'base' })` pour obtenir un tri naturel plus intuitif pour l'utilisateur.
