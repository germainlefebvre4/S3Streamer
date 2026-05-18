## ADDED Requirements

### Requirement: Buffer de navigation autonome du dialog
Lorsqu'une vidéo est ouverte depuis la grille, le dialog SHALL initialiser un buffer de navigation contenant les vidéos de la page courante, avec un index pointant sur la vidéo cliquée. Ce buffer SHALL capturer le contexte de la requête au moment de l'ouverture (requête de recherche active, mode shuffle, taille de page) et l'utiliser pour tous les chargements ultérieurs. La grille SHALL rester inchangée pendant la navigation dans le dialog.

#### Scenario: Ouverture depuis la grille
- **WHEN** l'utilisateur clique sur une card vidéo
- **THEN** le dialog s'ouvre sur cette vidéo
- **THEN** le buffer contient toutes les vidéos de la page courante dans leur ordre d'affichage
- **THEN** l'index du buffer pointe sur la vidéo cliquée

#### Scenario: Fermeture et réouverture du dialog
- **WHEN** l'utilisateur ferme le dialog puis clique sur une autre card
- **THEN** le buffer est réinitialisé avec les vidéos de la page courante au moment du nouveau clic

### Requirement: Zones de navigation latérales dans le dialog
Le dialog SHALL afficher deux zones cliquables pleine hauteur positionnées sur les côtés gauche et droit, contenant chacune une icône chevron SVG. Ces zones SHALL avoir une opacité réduite au repos et pleine au survol. La zone gauche SHALL être désactivée (invisible, non-cliquable) quand la vidéo courante est la première du buffer sans page précédente. La zone droite SHALL être désactivée quand la vidéo courante est la dernière du buffer et qu'il n'existe pas de page suivante. Pendant le chargement d'une page adjacente, la zone concernée SHALL afficher un état de chargement.

#### Scenario: Navigation vers la vidéo suivante
- **WHEN** l'utilisateur clique sur la zone de navigation droite
- **THEN** le dialog affiche la vidéo suivante dans le buffer
- **THEN** le titre du dialog est mis à jour

#### Scenario: Navigation vers la vidéo précédente
- **WHEN** l'utilisateur clique sur la zone de navigation gauche
- **THEN** le dialog affiche la vidéo précédente dans le buffer

#### Scenario: Première vidéo du buffer sans page précédente
- **WHEN** la vidéo courante est la première du buffer et aucune page précédente n'est disponible
- **THEN** la zone de navigation gauche est invisible et non-cliquable

#### Scenario: Dernière vidéo du buffer sans page suivante
- **WHEN** la vidéo courante est la dernière du buffer et `totalPages` est atteint
- **THEN** la zone de navigation droite est invisible et non-cliquable

### Requirement: Chargement transparent de la page suivante
Lorsque l'utilisateur navigue vers la droite depuis la dernière vidéo du buffer et qu'une page suivante existe, le dialog SHALL charger la page suivante via l'API avec le même contexte (recherche, mode) et ajouter les vidéos au buffer avant d'afficher la première vidéo de la nouvelle page. Si le chargement dure plus d'un instant perceptible, un indicateur de chargement SHALL s'afficher sur le bouton concerné.

#### Scenario: Navigation au bord de page avec page suivante disponible
- **WHEN** la vidéo courante est la dernière du buffer et une page suivante existe
- **WHEN** l'utilisateur clique sur la zone droite
- **THEN** la page suivante est chargée avec le même contexte de requête
- **THEN** les vidéos sont ajoutées au buffer
- **THEN** la première vidéo de la nouvelle page est affichée

#### Scenario: Cohérence du contexte lors du chargement cross-page
- **WHEN** le dialog charge une page supplémentaire
- **THEN** l'appel API utilise le filtre de recherche actif au moment de l'ouverture du dialog
- **THEN** l'appel API utilise le même mode (shuffle ou non) capturé à l'ouverture

### Requirement: Navigation clavier dans le dialog
Lorsque le dialog est ouvert, le système SHALL intercepter les touches `Ctrl+ArrowLeft` et `Ctrl+ArrowRight` pour naviguer entre les vidéos (comportement identique aux zones cliquables), et SHALL appeler `preventDefault()` sur ces événements pour éviter les conflits avec la navigation du navigateur. Les touches `ArrowLeft` et `ArrowRight` sans modificateur SHALL être laissées au comportement natif du player vidéo (seek). La touche `Escape` SHALL fermer le dialog.

#### Scenario: Navigation clavier vers la droite
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Ctrl+ArrowRight`
- **THEN** le comportement est identique à un clic sur la zone droite

#### Scenario: Navigation clavier vers la gauche
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Ctrl+ArrowLeft`
- **THEN** le comportement est identique à un clic sur la zone gauche

#### Scenario: Seek natif non perturbé
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `ArrowRight` sans `Ctrl`
- **THEN** le player vidéo avance nativement (seek +5s par défaut du navigateur)
- **THEN** aucune navigation vers la vidéo suivante ne se produit

#### Scenario: Fermeture par Escape
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Escape`
- **THEN** le dialog se ferme et la lecture s'arrête

### Requirement: Bouton Vidéo au hasard dans le dialog
Le dialog SHALL afficher en permanence un bouton "🎲 Vidéo au hasard" positionné sous le player vidéo. Lorsque le mode shuffle est inactif, ce bouton SHALL être visible mais désactivé visuellement (opacité réduite, `disabled`). Lorsque le mode shuffle est actif, ce bouton SHALL être pleinement actif et, au clic, vider le buffer, déclencher un nouveau fetch aléatoire, et ouvrir la première vidéo du nouveau tirage.

#### Scenario: Bouton visible hors mode shuffle
- **WHEN** le dialog est ouvert et le mode shuffle est inactif
- **THEN** le bouton "🎲 Vidéo au hasard" est visible mais désactivé

#### Scenario: Bouton actif en mode shuffle
- **WHEN** le dialog est ouvert et le mode shuffle est actif
- **THEN** le bouton "🎲 Vidéo au hasard" est pleinement actif et cliquable

#### Scenario: Clic sur Vidéo au hasard en mode shuffle
- **WHEN** le mode shuffle est actif et l'utilisateur clique sur "🎲 Vidéo au hasard"
- **THEN** le buffer est vidé
- **THEN** un nouveau fetch aléatoire est déclenché (`GET /api/videos?shuffle=true&...`)
- **THEN** le dialog affiche la première vidéo du nouveau tirage
