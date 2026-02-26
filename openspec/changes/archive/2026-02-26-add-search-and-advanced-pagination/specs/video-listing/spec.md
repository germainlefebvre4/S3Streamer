# Spec: Video Listing (delta)

## MODIFIED Requirements

### Requirement: Cohérence de la pagination UI
Le système SHALL calculer `totalPages` à partir du nombre total réel de vidéos après récupération complète et application du filtre `search`, garantissant que la navigation page par page couvre l'intégralité des résultats. L'interface SHALL afficher des boutons de pages numérotés avec une fenêtre glissante centrée sur la page courante, en plus des boutons Previous et Next. Les pages hors de la fenêtre glissante SHALL être représentées par des points de suspension (`…`). La page courante SHALL être visuellement distinguée des autres pages.

#### Scenario: Navigation vers la dernière page
- **WHEN** l'utilisateur navigue vers la dernière page
- **THEN** les vidéos affichées correspondent aux derniers éléments du catalogue filtré
- **THEN** le bouton Next est désactivé

#### Scenario: Affichage de la pagination numérotée — milieu
- **WHEN** `totalPages` est 20 et la page courante est 6
- **THEN** les boutons affichés sont : `1 … 4 5 [6] 7 8 … 20`

#### Scenario: Affichage de la pagination numérotée — début
- **WHEN** `totalPages` est 20 et la page courante est 2
- **THEN** les boutons affichés sont : `[2] 3 4 … 20` (ou `1 [2] 3 4 … 20` si la page 1 est toujours affichée)

#### Scenario: Affichage de la pagination numérotée — peu de pages
- **WHEN** `totalPages` est 5 ou moins
- **THEN** tous les numéros de pages sont affichés sans points de suspension

#### Scenario: Clic sur un numéro de page
- **WHEN** l'utilisateur clique sur le bouton de la page 8
- **THEN** la liste des vidéos est mise à jour pour afficher la page 8
- **THEN** l'URL passe à `?page=8` (et `&search=...` si une recherche est active)
