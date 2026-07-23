## MODIFIED Requirements

### Requirement: Navigation clavier dans le dialog
Lorsque le dialog est ouvert et qu'aucune modale de confirmation n'est active, le système SHALL intercepter :
- Les touches `Ctrl+ArrowLeft` et `Ctrl+ArrowRight` pour naviguer entre les vidéos (comportement identique aux zones cliquables), en appelant `preventDefault()` sur ces événements.
- Les raccourcis clavier classiques pour contrôler la vidéo :
  - La touche `Space` pour basculer entre Play et Pause (en appelant `preventDefault()`).
  - Les touches `ArrowLeft` et `ArrowRight` (sans `Ctrl`) pour reculer ou avancer de 10 secondes (en appelant `preventDefault()`).
  - Les touches `ArrowUp` et `ArrowDown` pour augmenter ou diminuer le volume de 10% (en appelant `preventDefault()`). Si le volume est augmenté alors que la vidéo est muette, le système SHALL désactiver le mode muet.
  - La touche `M` ou `m` pour basculer le mode muet (Mute / Unmute) (en appelant `preventDefault()`).
  - La touche `F` ou `f` pour basculer le mode plein écran natif de l'élément `<video>` (en appelant `preventDefault()`).
La touche `Escape` SHALL fermer le dialog. Le système SHALL ignorer ces raccourcis si l'utilisateur saisit du texte dans un champ de formulaire (comme `input` ou `textarea`).

#### Scenario: Navigation clavier vers la droite
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Ctrl+ArrowRight`
- **THEN** le comportement est identique à un clic sur la zone droite

#### Scenario: Navigation clavier vers la gauche
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Ctrl+ArrowLeft`
- **THEN** le comportement est identique à un clic sur la zone gauche

#### Scenario: Play/Pause par Espace
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Space`
- **THEN** le player vidéo bascule entre Play et Pause
- **THEN** le défilement de la page est empêché

#### Scenario: Seek par touches fléchées
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `ArrowRight` sans `Ctrl`
- **THEN** le player vidéo avance de 10 secondes
- **THEN** aucune navigation vers la vidéo suivante ne se produit

#### Scenario: Volume par touches fléchées
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `ArrowUp`
- **THEN** le volume augmente de 10%
- **THEN** le mode muet est désactivé si le volume augmente

#### Scenario: Basculement mode muet par M
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `M`
- **THEN** le player vidéo bascule entre muet et sonore

#### Scenario: Basculement plein écran par F
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `F`
- **THEN** le player vidéo bascule en mode plein écran natif de l'élément vidéo

#### Scenario: Saisie utilisateur protégée
- **WHEN** le dialog est ouvert et l'utilisateur saisit du texte dans un élément de type input ou textarea
- **THEN** les raccourcis clavier du lecteur ne sont pas activés

#### Scenario: Fermeture par Escape
- **WHEN** le dialog est ouvert et l'utilisateur appuie sur `Escape`
- **THEN** le dialog se ferme et la lecture s'arrête
