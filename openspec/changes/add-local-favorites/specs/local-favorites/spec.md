## ADDED Requirements

### Requirement: Persistance locale des favoris
Le système SHALL stocker la liste des favoris localement dans le navigateur de l'utilisateur sous la clé `s3streamer_favorites` dans le `localStorage`. La valeur stockée SHALL être un tableau sérialisé en JSON contenant les clés S3 uniques des vidéos favorites. Au chargement de l'application, cet état SHALL être chargé en mémoire dans un ensemble de type `Set` pour des vérifications rapides de présence.

#### Scenario: Premier chargement sans favoris préexistants
- **WHEN** l'utilisateur charge la page pour la première fois et qu'aucune clé `s3streamer_favorites` n'existe en localStorage
- **THEN** l'état en mémoire est initialisé avec un ensemble vide
- **THEN** l'application fonctionne normalement sans lever d'erreur

#### Scenario: Chargement avec favoris existants
- **WHEN** l'utilisateur charge la page et que `localStorage.getItem('s3streamer_favorites')` contient `["videos/vacances.mp4"]`
- **THEN** l'état en mémoire est initialisé avec un `Set` contenant `"videos/vacances.mp4"`

### Requirement: Bouton Favori sur les cartes de la grille
Chaque élément vidéo de la grille principale (carte) SHALL comporter un bouton d'interaction favori sous forme d'étoile (⭐ ou ☆). Si la vidéo est favorisée, l'étoile SHALL être affichée pleine (⭐) avec le titre (tooltip) "Retirer des favoris". Si la vidéo n'est pas favorisée, l'étoile SHALL être affichée vide (☆) avec le titre "Ajouter aux favoris". Le clic sur le bouton favori d'une carte SHALL basculer l'état de favori de la vidéo correspondante de manière réactive. Le clic sur l'étoile SHALL intercepter et bloquer la propagation de l'événement (`event.stopPropagation()`) pour éviter l'ouverture de la boîte de dialogue du lecteur vidéo.

#### Scenario: Clic sur étoile vide d'une carte
- **WHEN** l'utilisateur clique sur le bouton étoile vide (☆) d'une carte vidéo
- **THEN** la clé S3 de la vidéo est ajoutée au `Set` en mémoire et au `localStorage`
- **THEN** l'icône de l'étoile devient pleine (⭐)
- **THEN** la modale du lecteur vidéo ne s'ouvre pas

#### Scenario: Clic sur étoile pleine d'une carte en mode normal
- **WHEN** le filtre favoris est inactif et l'utilisateur clique sur l'étoile pleine (⭐) d'une carte
- **THEN** la clé S3 de la vidéo est retirée du `Set` en mémoire et du `localStorage`
- **THEN** l'icône de l'étoile devient vide (☆)
- **THEN** la carte reste affichée dans la grille

#### Scenario: Clic sur étoile pleine d'une carte en mode filtré (Option B)
- **WHEN** le filtre favoris est actif et l'utilisateur clique sur l'étoile pleine (⭐) d'une carte
- **THEN** la clé S3 de la vidéo est retirée du `Set` en mémoire et du `localStorage`
- **THEN** l'icône de l'étoile devient vide (☆)
- **THEN** la carte reste visible sur la page courante jusqu'au prochain rechargement ou changement de page

### Requirement: Bouton Favori dans le lecteur vidéo
L'en-tête du dialogue du lecteur vidéo (modale) SHALL afficher un bouton favori d'interaction (⭐ ou ☆) à gauche du bouton de suppression (🗑). L'état visuel du bouton de la modale SHALL correspondre à l'état de favori en temps réel de la vidéo actuellement lue. Le clic sur ce bouton de la modale SHALL basculer l'état favori dans le stockage local et synchroniser immédiatement l'étoile de la carte vidéo correspondante située en arrière-plan dans la grille principale.

#### Scenario: Ouverture du lecteur d'une vidéo favorite
- **WHEN** l'utilisateur clique sur une carte vidéo dont la clé est favorite
- **THEN** le lecteur vidéo s'ouvre et le bouton favori de l'en-tête affiche une étoile pleine (⭐)

#### Scenario: Basculement de favori depuis le lecteur
- **WHEN** l'utilisateur clique sur l'étoile dans l'en-tête du lecteur vidéo
- **THEN** l'état favori de cette vidéo est inversé dans le `localStorage`
- **THEN** l'icône de l'étoile du lecteur est mise à jour immédiatement
- **THEN** l'étoile sur la carte vidéo correspondante dans la grille sous-jacente est mise à jour immédiatement

### Requirement: Bouton de filtre rapide des favoris
La barre d'outils principale SHALL intégrer un bouton de filtre favoris (⭐) à gauche du bouton mode aléatoire (🔀). Ce bouton SHALL agir comme un commutateur bistable (toggle). Lorsqu'il est activé, il SHALL porter la classe CSS `.active` et déclencher le rechargement de la grille vidéo en page 1 en transmettant la liste complète des favoris au backend.

#### Scenario: Activation du filtre favoris avec des favoris enregistrés
- **WHEN** l'utilisateur active le filtre favoris alors que `"videos/vacances.mp4"` est dans les favoris
- **THEN** le bouton filtre prend la classe `.active`
- **THEN** l'application effectue une requête d'API vers `/api/videos` en passant la liste JSON des favoris dans le paramètre de requête `favorites`
- **THEN** la grille affiche uniquement la vidéo `"videos/vacances.mp4"`

#### Scenario: Activation du filtre favoris sans favoris enregistrés
- **WHEN** l'utilisateur active le filtre favoris alors que la liste des favoris is vide
- **THEN** le bouton filtre prend la classe `.active`
- **THEN** la grille n'affiche aucune vidéo et affiche le message explicatif : "Vous n'avez pas encore de favoris. Cliquez sur ⭐ pour en ajouter."

### Requirement: Prise en charge du filtrage côté serveur
Le point de terminaison de l'API GET `/api/videos` SHALL accepter un paramètre de requête optionnel nommé `favorites`. Si ce paramètre est présent, le serveur SHALL tenter de le parser comme un tableau JSON de chaînes (les clés favorites). Si le parsing réussit, le serveur SHALL filtrer la liste complète de vidéos S3 pour ne conserver que celles dont la clé S3 figure dans ce tableau, avant d'appliquer les filtres de recherche (le cas échéant), le mélange aléatoire (shuffle) et la pagination.

#### Scenario: Requête API avec filtre de favoris et pagination
- **WHEN** le serveur reçoit une requête avec `favorites=["v1.mp4","v2.mp4","v3.mp4"]` et `pageSize=2` et `page=1`
- **THEN** il filtre la liste globale pour ne retenir que `["v1.mp4","v2.mp4","v3.mp4"]` (si elles existent sur S3)
- **THEN** il retourne les 2 premières vidéos de cette sélection avec un indicateur `hasNextPage: true` et `totalPages: 2`
