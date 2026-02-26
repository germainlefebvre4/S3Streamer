## Context

Depuis `remove-page-limit`, `videoController.js` parcourt tous les objets S3 à chaque requête via une boucle de continuation tokens. Sur un grand bucket (ex. 5 000 vidéos = 5 appels S3 × ~200 ms = ~1 s par changement de page), l'expérience utilisateur est dégradée. La liste de vidéos évolue rarement : un cache en mémoire avec TTL est la solution la plus simple et la plus efficace sans infrastructure supplémentaire.

## Goals / Non-Goals

**Goals:**
- Mettre en cache la liste complète des objets S3 (avant filtrage et pagination) en mémoire Node.js.
- Servir toutes les requêtes de pagination depuis le cache après le premier chargement.
- Permettre de configurer le TTL via une variable d'environnement.
- Invalider le cache automatiquement à l'expiration du TTL.

**Non-Goals:**
- Cache distribué (Redis, Memcached) — inutile pour un déploiement mono-instance.
- Invalidation manuelle du cache via une API dédiée.
- Cache des URLs signées ou des pages paginées individuelles.
- Rafraîchissement proactif en arrière-plan (background refresh) — complexité non justifiée.

## Decisions

### Cache module-level dans `videoController.js` (vs module séparé)

Le cache est stocké dans deux variables module-level : `cachedContents` (tableau) et `cacheExpiresAt` (timestamp). Avant chaque requête, on vérifie si `Date.now() < cacheExpiresAt`. Si oui, on réutilise `cachedContents`. Sinon, on relance la boucle S3 et on met à jour le cache.

**Pourquoi pas un module séparé ?** La logique est triviale (2 variables + 1 condition) ; extraire un module de cache générique serait une sur-ingénierie pour ce besoin.

**Pourquoi pas `node-cache` ou similaire ?** Dépendance externe non justifiée pour une structure aussi simple.

### TTL de 5 minutes par défaut, configurable via `CACHE_TTL_SECONDS`

5 minutes est un compromis raisonnable : assez long pour absorber les rafales de navigation, assez court pour refléter les ajouts récents dans le bucket. Les opérateurs peuvent ajuster via l'environnement sans redéploiement.

### Pas d'invalidation sur mutation

S3 ne pousse pas d'événements au serveur par défaut. Une invalidation explicite nécessiterait soit un webhook S3, soit une API d'administration. Le TTL suffit pour le cas d'usage actuel.

## Risks / Trade-offs

- **Données périmées pendant le TTL** → Acceptable : les vidéos s'ajoutent rarement en cours de session. Documenté dans les commentaires de code.
- **Mémoire** → Métadonnées uniquement (pas de binaires) ; 10 000 objets ≈ quelques Mo. Négligeable.
- **Concurrence de requêtes simultanées pendant le cache froid** → Plusieurs requêtes simultanées lors du premier chargement déclencheront chacune leur propre boucle S3. Mitigation : comportement transitoire limité à la première seconde de vie du serveur ou après expiration du TTL.

## Migration Plan

1. Modifier uniquement `src/controllers/videoController.js`.
2. Aucun changement d'API, de base de données ou de frontend.
3. Rollback : revenir au commit précédent sur ce fichier.
