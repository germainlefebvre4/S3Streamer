## Context

Le backend Express récupère l'intégralité des objets S3 via des continuation tokens, filtre les vidéos par extension, puis pagine en mémoire. La réponse JSON expose déjà `page`, `pageSize`, `totalPages`, `totalVideos`, `hasNextPage` et `hasPrevPage`. Le frontend est en vanilla HTML/JS sans framework ni build step.

## Goals / Non-Goals

**Goals:**
- Ajouter un paramètre `search` à `GET /api/videos` pour filtrer par nom de fichier (substring insensible à la casse).
- Remplacer la navigation Previous/Next par des boutons de pages numérotés avec fenêtre glissante et ellipses.
- Remettre la page à 1 automatiquement lors d'une nouvelle recherche.

**Non-Goals:**
- Filtrage côté S3 (impossible sur les noms de fichiers avec `ListObjectsV2`).
- Tri des résultats (hors scope).
- Selector de `pageSize` dans l'UI (le paramètre backend reste disponible mais sans contrôle graphique).
- Pagination infinie ou "load more".

## Decisions

### 1. Filtrage en mémoire après récupération complète
**Choix:** Conserver le fetch complet et filtrer en mémoire avec `String.includes()` insensible à la casse.
**Pourquoi:** S3 `ListObjectsV2` ne supporte pas de filtre substring sur les clés. L'approche est déjà en place et reste performante pour les catalogues attendus (< 10 000 fichiers).
**Alternative écartée:** Prefix S3 — ne couvre pas les sous-chaînes au milieu d'un chemin.

### 2. Debounce côté frontend (300 ms)
**Choix:** Déclencher la requête 300 ms après la dernière frappe dans le champ de recherche.
**Pourquoi:** Évite les appels API à chaque keystroke sans alourdir l'UX.
**Alternative écartée:** Soumission sur `Enter` uniquement — moins fluide.

### 3. Pagination numérotée avec fenêtre glissante
**Choix:** Afficher toujours la première et dernière page, plus 2 pages de chaque côté de la page courante, séparées par `…` si nécessaire.
**Format:** `1 … 4 5 [6] 7 8 … 20`
**Pourquoi:** Pattern standard reconnu des utilisateurs, implémentable en vanilla JS sans dépendance.
**Alternative écartée:** Afficher toutes les pages — illisible au-delà de 10-15 pages.

### 4. Synchronisation état via URL query string
**Choix:** `?page=X&search=Y` dans l'URL à chaque changement, rechargement/partage préserve l'état.
**Pourquoi:** Déjà fait pour `page`, l'étendre à `search` est cohérent.

## Risks / Trade-offs

- **Latence sur grands buckets** → Le filtrage en mémoire reste O(n) et rapide; le goulot d'étranglement reste le fetch S3, inchangé. Risque acceptable.
- **Debounce et UX** → 300 ms peut paraître lent sur connexion rapide. Valeur ajustable dans le code si nécessaire.
- **Compatibilité URL** → `encodeURIComponent` appliqué sur le paramètre `search` avant insertion dans l'URL.

## Migration Plan

- Changement backward-compatible : le paramètre `search` est optionnel, comportement inchangé si absent.
- Pas de migration de données ni de rollback spécifique requis.
- Déploiement en remplacement direct (pas de feature flag).
