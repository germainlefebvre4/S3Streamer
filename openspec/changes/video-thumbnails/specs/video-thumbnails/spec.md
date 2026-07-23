## ADDED Requirements

### Requirement: Génération de miniatures à la demande sécurisée
Le système SHALL exposer un point de terminaison API `/api/videos/thumbnail/:key` qui accepte une clé relative S3, calcule son hash MD5 pour identifier de manière déterministe un fichier image `<md5_hash>.jpg` dans le cache disque local (`src/public/thumbnails/`), et sert directement ce fichier s'il est présent. Si l'image n'est pas présente, le système SHALL générer une URL S3 signée à courte durée de vie, l'ouvrir sous forme de flux dans FFmpeg, extraire une frame à 2 secondes au format JPEG `320x180`, l'écrire dans le dossier de cache local, puis renvoyer le fichier généré. Le système SHALL interdire toute exécution concurrente de FFmpeg pour une même clé S3 en maintenant une file d'attente d'exécutions actives en mémoire.

#### Scenario: Miniature déjà présente en cache
- **WHEN** le client demande la miniature d'une clé S3 et le fichier `<md5_hash>.jpg` existe dans le répertoire de cache local
- **THEN** le système renvoie immédiatement le fichier image en cache sans interroger S3 ni exécuter FFmpeg

#### Scenario: Miniature non présente en cache
- **WHEN** le client demande la miniature d'une clé S3 et le fichier n'existe pas en cache
- **THEN** le système génère une URL signée S3 de 5 minutes
- **THEN** le système lance FFmpeg sur l'URL pour extraire une frame à 2 secondes et l'enregistre au format JPEG `320x180` dans le cache local
- **THEN** le système sert l'image finale au client

#### Scenario: Requêtes simultanées pour la même miniature
- **WHEN** plusieurs requêtes simultanées sont reçues pour la même clé S3 non encore présente en cache
- **THEN** le système ne lance qu'un seul processus FFmpeg d'extraction
- **THEN** toutes les requêtes en attente sont résolues avec l'image générée dès la fin de l'extraction unique

### Requirement: Contrôle par variable d'environnement (Toggle)
Le système SHALL prendre en compte la variable d'environnement `ENABLE_THUMBNAILS`. Si sa valeur est configurée à `false`, le point de terminaison de miniatures `/api/videos/thumbnail/:key` SHALL retourner une erreur `403 Forbidden`, et la réponse JSON de la liste des vidéos `/api/videos` SHALL retourner un objet `config` contenant `thumbnailsEnabled: false`. Si la variable n'est pas définie ou a une autre valeur, `config.thumbnailsEnabled` SHALL valoir `true`.

#### Scenario: Option désactivée par configuration
- **WHEN** `ENABLE_THUMBNAILS=false` est défini dans le fichier d'environnement
- **THEN** l'appel à `/api/videos` contient `"config": { "thumbnailsEnabled": false }`
- **THEN** l'accès direct à `/api/videos/thumbnail/:key` retourne un code d'erreur `403`

#### Scenario: Option activée par défaut ou explicitement
- **WHEN** `ENABLE_THUMBNAILS` est absent ou défini à `true`
- **THEN** l'appel à `/api/videos` contient `"config": { "thumbnailsEnabled": true }`

### Requirement: Aperçu vidéo dynamique au survol
Pour les formats de vidéos nativement supportés par le navigateur du client, l'interface utilisateur SHALL déclencher un aperçu vidéo en direct au survol de la carte. Cet aperçu SHALL consister en l'injection d'une balise `<video>` muette (`muted`), jouée en boucle (`loop`) et intégrée (`playsinline`), démarrant à `currentTime = 2` secondes. L'initialisation de l'aperçu SHALL être retardée (debounced) de 400 millisecondes pour éviter les surcharges réseau lors de survols rapides de la grille.

#### Scenario: Survol prolongé d'un format supporté
- **WHEN** l'utilisateur positionne le curseur sur le conteneur de miniature d'une vidéo MP4 pendant plus de 400 millisecondes
- **THEN** une balise `<video>` muette est injectée et commence la lecture en boucle à 2 secondes de la vidéo
- **THEN** l'aperçu vidéo effectue une transition d'opacité fluide pour se superposer à la miniature statique

#### Scenario: Sortie du curseur de la carte vidéo
- **WHEN** le curseur quitte la carte de la vidéo dont l'aperçu est en cours de lecture
- **THEN** la balise `<video>` injectée est immédiatement mise en pause, supprimée du DOM et sa mémoire est libérée

#### Scenario: Balayage rapide de la grille
- **WHEN** le curseur passe rapidement sur plusieurs cartes vidéo sans s'arrêter plus de 400 millisecondes
- **THEN** aucun conteneur de prévisualisation vidéo n'est instancié et aucun flux réseau n'est initié

#### Scenario: Format non supporté nativement
- **WHEN** la vidéo survolée possède une extension non prise en charge nativement par le navigateur (ex. AVI)
- **THEN** l'interface utilisateur n'initie aucun lecteur vidéo au survol et conserve l'image statique de la miniature
