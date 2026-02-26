## MODIFIED Requirements

### Requirement: Récupération complète des objets S3
Le système SHALL parcourir toutes les pages de résultats S3 en suivant les continuation tokens jusqu'à ce que `IsTruncated` soit `false`, afin d'obtenir la liste exhaustive des objets du bucket avant d'appliquer le filtrage et la pagination. Cette récupération complète SHALL être mise en cache en mémoire et réutilisée pour toutes les requêtes de pagination suivantes jusqu'à expiration du TTL.

#### Scenario: Bucket avec plus de 1000 objets
- **WHEN** le bucket S3 contient plus de 1000 objets
- **THEN** le système récupère tous les objets en enchaînant les appels `ListObjectsV2` avec `NextContinuationToken`
- **THEN** `totalVideos` reflète le nombre réel de vidéos dans le bucket

#### Scenario: Bucket avec 1000 objets ou moins
- **WHEN** le bucket S3 contient 1000 objets ou moins
- **THEN** le système effectue un seul appel `ListObjectsV2` (comportement inchangé)

#### Scenario: Bucket vide
- **WHEN** le bucket S3 ne contient aucun objet
- **THEN** le système retourne une liste vide et `totalPages` est 0

#### Scenario: Récupération depuis le cache
- **WHEN** le cache est valide
- **THEN** le système utilise la liste en cache sans appeler S3
- **THEN** le filtrage par extension et la pagination sont appliqués sur la liste en cache
