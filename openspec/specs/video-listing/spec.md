# Spec: Video Listing

## Purpose

TBD - Defines the behaviour of the video listing feature, including how S3 objects are retrieved and how pagination is computed and exposed to the UI.

## Requirements

### Requirement: Récupération complète des objets S3
Le système SHALL parcourir toutes les pages de résultats S3 en suivant les continuation tokens jusqu'à ce que `IsTruncated` soit `false`, afin d'obtenir la liste exhaustive des objets du bucket avant d'appliquer le filtrage et la pagination. Cette récupération complète SHALL être mise en cache en mémoire et réutilisée pour toutes les requêtes de pagination suivantes jusqu'à expiration du TTL. Le cache SHALL également pouvoir être modifié chirurgicalement (retrait d'une entrée par `Key`) sans invalider l'ensemble du cache, notamment lors de la suppression d'un objet S3.

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

#### Scenario: Cache mis à jour après suppression d'un objet
- **WHEN** un objet S3 est supprimé via l'API
- **THEN** l'entrée correspondante est retirée de `cachedContents` par comparaison de `Key`
- **THEN** les appels suivants à `/api/videos` ne retournent plus la vidéo supprimée
- **THEN** le reste du cache reste valide jusqu'à expiration du TTL

### Requirement: Cohérence de la pagination UI
Le système SHALL calculer `totalPages` à partir du nombre total réel de vidéos après récupération complète et application du filtre `search`, garantissant que la navigation page par page couvre l'intégralité des résultats. L'interface SHALL afficher des boutons de pages numérotés avec une fenêtre glissante centrée sur la page courante, en plus des boutons Previous et Next. Les pages hors de la fenêtre glissante SHALL être représentées par des points de suspension (`…`). La page courante SHALL être visuellement distinguée des autres pages. Le `pageSize` utilisé pour la pagination SHALL être déterminé par la configuration de la grille (colonnes × lignes).

#### Scenario: Navigation vers la dernière page
- **WHEN** l'utilisateur navigue vers la dernière page
- **THEN** les vidéos affichées correspondent aux derniers éléments du catalogue filtré
- **THEN** le bouton Next est désactivé

#### Scenario: Affichage de la pagination numérotée — milieu
- **WHEN** `totalPages` est 20 et la page courante est 6
- **THEN** les boutons affichés sont : `1 … 4 5 [6] 7 8 … 20`

#### Scenario: Affichage de la pagination numérotée — début
- **WHEN** `totalPages` est 20 et la page courante est 2
- **THEN** les boutons affichés sont : `1 [2] 3 4 … 20`

#### Scenario: Affichage de la pagination numérotée — peu de pages
- **WHEN** `totalPages` est 5 ou moins
- **THEN** tous les numéros de pages sont affichés sans points de suspension

#### Scenario: Clic sur un numéro de page
- **WHEN** l'utilisateur clique sur le bouton de la page 8
- **THEN** la liste des vidéos est mise à jour pour afficher la page 8
- **THEN** l'URL passe à `?page=8` (et `&search=...` si une recherche est active)

#### Scenario: Changement de configuration de la grille
- **WHEN** l'utilisateur applique une nouvelle config (ex. 4 colonnes × 2 lignes)
- **THEN** `pageSize` vaut 8 pour le fetch suivant
- **THEN** la pagination est recalculée avec ce nouveau `pageSize`

### Requirement: Apparence uniforme des cards vidéo
Les cards vidéo SHALL être construites en React et stylisées avec Tailwind CSS. Elles SHALL avoir une hauteur fixe, indépendante de la longueur du nom de fichier. Le nom de fichier SHALL être tronqué avec points de suspension si sa longueur dépasse la largeur de la card. Les métadonnées (taille, date) SHALL être alignées en bas de la card. Le nombre de colonnes de la grille SHALL correspondre à la valeur configurée dans la configuration de la grille, et utiliser des classes de grille Tailwind réactives. Un effet de survol (hover) doux avec bordure lumineuse (glow) et zoom léger SHALL être appliqué.

#### Scenario: Noms de fichiers de longueurs différentes
- **WHEN** la grille affiche des vidéos avec des noms courts et longs mélangés
- **THEN** toutes les cards ont la même hauteur et le même style sombre uniforme
- **THEN** les noms longs sont tronqués avec `…` et ne modifient pas les dimensions de la card

#### Scenario: Nombre de colonnes configuré à 4
- **WHEN** la configuration de la grille est de 4 colonnes
- **THEN** la grille CSS Tailwind affiche exactement 4 colonnes sur les écrans larges
