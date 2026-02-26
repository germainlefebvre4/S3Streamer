## ADDED Requirements

### Requirement: Récupération complète des objets S3
Le système SHALL parcourir toutes les pages de résultats S3 en suivant les continuation tokens jusqu'à ce que `IsTruncated` soit `false`, afin d'obtenir la liste exhaustive des objets du bucket avant d'appliquer le filtrage et la pagination.

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

### Requirement: Cohérence de la pagination UI
Le système SHALL calculer `totalPages` à partir du nombre total réel de vidéos après récupération complète, garantissant que la navigation page par page couvre l'intégralité du catalogue.

#### Scenario: Navigation vers la dernière page
- **WHEN** l'utilisateur navigue vers la dernière page
- **THEN** les vidéos affichées correspondent aux derniers éléments du bucket, y compris ceux qui se trouvaient au-delà du 1000ème objet S3
