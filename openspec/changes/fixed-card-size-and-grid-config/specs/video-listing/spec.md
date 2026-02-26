# Spec: Video Listing (delta)

## MODIFIED Requirements

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
Les cards vidéo SHALL avoir une hauteur fixe, indépendante de la longueur du nom de fichier. Le nom de fichier SHALL être tronqué avec points de suspension si sa longueur dépasse la largeur de la card. Les métadonnées (taille, date) SHALL être alignées en bas de la card. Le nombre de colonnes de la grille SHALL correspondre à la valeur configurée dans la configuration de la grille.

#### Scenario: Noms de fichiers de longueurs différentes
- **WHEN** la grille affiche des vidéos avec des noms courts et longs mélangés
- **THEN** toutes les cards ont la même hauteur
- **THEN** les noms longs sont tronqués avec `…` et ne font pas grandir la card

#### Scenario: Nombre de colonnes configuré à 4
- **WHEN** la configuration de la grille est 4 colonnes
- **THEN** la grille CSS affiche exactement 4 colonnes
