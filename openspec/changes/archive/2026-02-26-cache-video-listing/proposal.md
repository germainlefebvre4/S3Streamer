## Why

Depuis l'implémentation de la récupération complète des objets S3 (pagination par continuation tokens), chaque requête `/api/videos` enchaîne N appels `ListObjectsV2` en série, causant des temps de réponse élevés dès que le bucket dépasse 1 000 objets. La liste de vidéos est quasi-statique (les ajouts sont rares) : un cache serveur en mémoire avec TTL permet d'absorber l'ensemble des requêtes de pagination sans retoucher S3.

## What Changes

- Ajout d'un cache en mémoire côté serveur pour la liste complète des objets S3.
- Le premier appel remplit le cache (peut être lent) ; tous les appels suivants retournent le résultat instantanément depuis le cache.
- Le cache expire après un TTL configurable (défaut : 5 minutes), déclenchant un rafraîchissement silencieux en arrière-plan.
- Aucun changement d'API REST ni de contrat de réponse JSON.

## Capabilities

### New Capabilities
- `video-listing-cache`: Cache en mémoire pour la liste des vidéos S3, avec TTL configurable et invalidation automatique.

### Modified Capabilities
- `video-listing`: Le comportement observable reste identique (même réponse JSON), mais la source des données peut être le cache plutôt que S3 directement.

## Impact

- `src/controllers/videoController.js` : ajout du cache (module-level variable ou module dédié).
- Aucune dépendance externe requise (cache en mémoire Node.js natif).
- Variable d'environnement optionnelle `CACHE_TTL_SECONDS` pour configurer la durée de vie du cache.
