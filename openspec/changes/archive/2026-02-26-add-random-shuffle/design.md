## Context

Le backend Express récupère tous les objets S3 (avec cache TTL), filtre par extension et par `search`, puis pagine. Le frontend est en vanilla HTML/CSS/JS avec une toolbar comprenant un champ de recherche et un bouton ⚙. La grille est pilotée par `gridConfig.cols × gridConfig.rows = pageSize`.

## Goals / Non-Goals

**Goals:**
- Ajouter un paramètre `shuffle=true` à `GET /api/videos` : le backend renvoie `pageSize` vidéos tirées aléatoirement parmi la liste filtrée, avec `totalPages=1`.
- Bouton 🔀 dans la toolbar pour activer/désactiver le mode aléatoire.
- En mode actif : pagination masquée, bouton "Nouveau tirage" affiché.
- Compatible avec le filtre `search` actif.

**Non-Goals:**
- Seed de session (pas de reproductibilité inter-requêtes — chaque tirage est indépendant).
- Persistance du mode shuffle dans l'URL ou localStorage.
- Tri ou pondération (tous les items ont la même probabilité de sélection).

## Decisions

### 1. Shuffle côté backend via Fisher-Yates
**Choix:** Copier `filteredVideos`, appliquer Fisher-Yates, prendre les `pageSize` premiers éléments. Retourner `totalPages: 1`, `page: 1`.
**Pourquoi:** La liste complète est déjà en mémoire (cache). Le shuffle est O(n), rapide. Renvoyer `totalPages: 1` empêche tout calcul de pagination côté client.
**Alternative écartée:** Shuffle côté frontend uniquement — nécessiterait de charger plus d'items que `pageSize`.

### 2. Paramètre `shuffle` optionnel, backward-compatible
**Choix:** `shuffle=true` dans la query string. Si absent ou `false`, comportement inchangé.
**Pourquoi:** Zéro impact sur les clients existants.

### 3. Bouton 🔀 dans la toolbar, avec état visuel actif
**Choix:** Même style que `.config-btn` avec une classe `.active` qui change le fond (vert) quand le mode est actif. Placement : entre le champ de recherche et le bouton ⚙.
**Pourquoi:** Cohérence visuelle avec la toolbar existante.

### 4. Bouton "Nouveau tirage" dans la zone pagination
**Choix:** Quand `shuffleMode` est actif, `updatePagination` est court-circuité et un seul bouton "🔀 Nouveau tirage" est injecté dans `paginationElement` à la place des contrôles habituels.
**Pourquoi:** Réutilise l'élément DOM `#pagination` existant sans ajouter de structure HTML supplémentaire.

### 5. Désactivation du mode shuffle
**Choix:** Reclic sur 🔀 → `shuffleMode = false` → `fetchVideos(1)` en mode normal, pagination restaurée.
**Pourquoi:** Toggle simple et prévisible.

## Risks / Trade-offs

- **Grands catalogues** → Fisher-Yates sur N éléments est rapide (<1ms pour N<100k). Risque négligeable.
- **Interaction avec search** → Si `search` réduit le catalogue à moins de `pageSize` items, tous les items correspondants sont renvoyés (shuffle sur un sous-ensemble plus petit que demandé). Comportement acceptable.
