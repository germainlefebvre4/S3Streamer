## MODIFIED Requirements

### Requirement: Zones de navigation latérales dans le dialog
Le dialog (construit avec `Radix Dialog`) SHALL afficher deux zones cliquables pleine hauteur positionnées sur les côtés gauche et droit, contenant chacune une icône chevron moderne (Lucide React). Ces zones SHALL avoir une opacité réduite au repos et pleine au survol, avec une transition CSS fluide. La zone gauche SHALL être invisible et non-cliquable quand la vidéo courante est la première du buffer sans page précédente. La zone droite SHALL être invisible et non-cliquable quand la vidéo courante est la dernière du buffer et qu'il n'existe pas de page suivante. Pendant le chargement d'une page adjacente, la zone concernée SHALL afficher un état de chargement (spinner).

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

### Requirement: Navigation clavier dans le dialog
Lorsque le dialog `Radix Dialog` est ouvert, le système SHALL intercepter les touches `Ctrl+ArrowLeft` et `Ctrl+ArrowRight` pour naviguer entre les vidéos (comportement identique aux zones cliquables), et SHALL appeler `preventDefault()` sur ces événements pour éviter les conflits avec le navigateur. Les touches `ArrowLeft` et `ArrowRight` sans modificateur SHALL être laissées au comportement natif du player vidéo (seek). La touche `Escape` ou un clic sur l'overlay extérieur de Radix SHALL fermer le dialog.

#### Scenario: Navigation clavier vers la droite
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Ctrl+ArrowRight`
- **THEN** le comportement est identique à un clic sur la zone droite

#### Scenario: Navigation clavier vers la gauche
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Ctrl+ArrowLeft`
- **THEN** le comportement est identique à un clic sur la zone gauche

#### Scenario: Seek natif non perturbé
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `ArrowRight` sans `Ctrl`
- **THEN** le player vidéo avance nativement (seek)
- **THEN** aucune navigation vers la vidéo suivante ne se produit

#### Scenario: Fermeture par Escape ou clic overlay
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Escape` ou clique sur l'overlay Radix
- **THEN** le dialog se ferme et la lecture s'arrête
