## 1. Cache en mémoire

- [x] 1.1 Ajouter deux variables module-level dans `src/controllers/videoController.js` : `let cachedContents = null` et `let cacheExpiresAt = 0`
- [x] 1.2 Lire `CACHE_TTL_SECONDS` depuis `process.env` avec valeur par défaut de 300
- [x] 1.3 Envelopper la boucle de récupération S3 dans un bloc conditionnel : si `Date.now() < cacheExpiresAt`, utiliser `cachedContents` ; sinon exécuter la boucle et mettre à jour le cache avec le nouveau `cacheExpiresAt`

## 2. Vérification

- [x] 2.1 Vérifier que le deuxième appel à `/api/videos` ne génère pas d'appels S3 supplémentaires (logs serveur)
- [x] 2.2 Vérifier que le cache expire bien après le TTL configuré (tester avec `CACHE_TTL_SECONDS=5`)
