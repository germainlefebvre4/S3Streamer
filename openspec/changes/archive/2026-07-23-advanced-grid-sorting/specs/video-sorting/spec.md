## ADDED Requirements

### Requirement: Paramètre sort sur l'API de listing des vidéos
L'API `GET /api/videos` SHALL accepter un paramètre de requête `sort`. Lorsque `shuffle` est absent ou faux, le système SHALL trier la liste des vidéos filtrées selon le paramètre `sort` avant d'appliquer la pagination.
Les valeurs de `sort` supportées SHALL être :
- `name_asc` (par défaut) : Tri alphabétique croissant par clé d'objet S3 (Key).
- `name_desc` : Tri alphabétique décroissant par clé d'objet S3 (Key) (Alphabétique inverse).
- `date_desc` : Tri chronologique décroissant par date de dernière modification (LastModified), affichant les vidéos les plus récentes en premier.
- `size_desc` : Tri par taille de fichier décroissante (Size), affichant les vidéos les plus volumineuses en premier.

#### Scenario: Tri par défaut (Nom A-Z)
- **WHEN** le client soumet `GET /api/videos` sans paramètre de tri
- **THEN** la liste retournée est ordonnée par `key` de façon croissante

#### Scenario: Tri alphabétique inverse (Nom Z-A)
- **WHEN** le client soumet `GET /api/videos?sort=name_desc`
- **THEN** la liste retournée est ordonnée par `key` de façon décroissante

#### Scenario: Tri par date de modification (Date la plus récente)
- **WHEN** le client soumet `GET /api/videos?sort=date_desc`
- **THEN** la liste retournée est ordonnée par `lastModified` de la plus récente à la plus ancienne

#### Scenario: Tri par taille de fichier (Plus grand d'abord)
- **WHEN** le client soumet `GET /api/videos?sort=size_desc`
- **THEN** la liste retournée est ordonnée par `size` de la plus grande à la plus petite

### Requirement: Sélecteur de tri sur l'UI
L'interface utilisateur SHALL afficher un élément `<select>` avec l'identifiant `sort-select` dans la toolbar, à côté du champ de recherche. Ce sélecteur SHALL permettre à l'utilisateur de choisir entre les quatre options de tri et SHALL déclencher le rechargement immédiat de la liste depuis la page 1 avec le tri sélectionné.

#### Scenario: Modification du tri par l'utilisateur
- **WHEN** l'utilisateur change la valeur du sélecteur à "Date de modification (plus récent)"
- **THEN** la liste des vidéos est immédiatement rechargée depuis la page 1
- **THEN** l'appel API contient `sort=date_desc`
- **THEN** l'URL du navigateur est mise à jour avec `&sort=date_desc`

### Requirement: Interaction entre le tri et le mode aléatoire (shuffle)
Le sélecteur de tri et le mode aléatoire (shuffle) SHALL être mutuellement exclusifs.
- Lorsque le mode aléatoire est activé (clic sur le bouton 🔀), le sélecteur `sort-select` SHALL être désactivé (`disabled`).
- Lorsque l'utilisateur change la valeur du sélecteur `sort-select` alors que le mode aléatoire est actif, le mode aléatoire SHALL être désactivé (le bouton 🔀 reprend son apparence normale) et la liste est rechargée avec le tri demandé.

#### Scenario: Activation du mode shuffle désactive le sélecteur de tri
- **WHEN** l'utilisateur active le mode aléatoire (shuffle)
- **THEN** le sélecteur `sort-select` devient désactivé et grisé
- **THEN** le tri sélectionné n'est pas envoyé à l'API (seul `shuffle=true` est passé)

#### Scenario: Changement de tri désactive le mode shuffle
- **WHEN** le mode aléatoire est actif et l'utilisateur choisit un tri dans le sélecteur
- **THEN** le mode aléatoire est désactivé (shuffleMode devient false)
- **THEN** la liste est chargée avec le paramètre de tri sélectionné

### Requirement: Persistance de l'état du tri dans l'URL
L'état du tri choisi par l'utilisateur SHALL être synchronisé dans l'URL du navigateur sous le paramètre de requête `sort` (sauf s'il s'agit du tri par défaut `name_asc` ou si le mode aléatoire est actif), garantissant qu'un rechargement de page ou un partage de lien conserve le critère de tri actif.

#### Scenario: Chargement initial avec un paramètre de tri dans l'URL
- **WHEN** l'utilisateur charge la page avec l'URL `/?sort=size_desc`
- **THEN** le sélecteur de tri se positionne automatiquement sur "Taille du fichier"
- **THEN** la liste des vidéos est chargée en utilisant le tri par taille

### Requirement: Cohérence du tri lors de la navigation dans le dialog
Lorsque l'utilisateur ouvre un dialog vidéo, la navigation latérale (flèches ← ►) SHALL respecter l'ordre trié choisi. Si le dialog atteint la fin du buffer actuel et charge la page suivante en arrière-plan, cette requête SHALL utiliser le même paramètre `sort` que celui sélectionné dans l'interface principale.

#### Scenario: Chargement de la page suivante depuis le dialogue en mode trié
- **WHEN** l'utilisateur navigue au-delà de la dernière vidéo du buffer dans le dialog alors que le tri par date est actif
- **THEN** la requête de page suivante envoyée à `/api/videos` contient le paramètre `sort=date_desc`
- **THEN** les nouvelles vidéos ajoutées au buffer respectent l'ordre de tri chronologique
