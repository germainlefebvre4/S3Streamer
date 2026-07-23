## MODIFIED Requirements

### Requirement: Apparence uniforme des cards vidéo
Les cards vidéo SHALL avoir une apparence uniforme de même hauteur sur toute la grille, s'adaptant de manière cohérente selon l'état de la configuration des miniatures. 

Lorsque la configuration `thumbnailsEnabled` de l'API est `true`, la card SHALL adopter un mode visuel (`visual`) incluant un conteneur au format 16:9 affichant la miniature chargée paresseusement (`loading="lazy"`), le titre tronqué en dessous et les métadonnées (taille, date) alignées en bas.
Lorsque `thumbnailsEnabled` est `false`, la card SHALL adopter un mode compact (`compact`) sans conteneur de miniature, d'une hauteur fixe de 100px contenant le nom de fichier tronqué et ses métadonnées alignées en bas (comportement d'origine).

Le nombre de colonnes de la grille SHALL correspondre à la valeur configurée dans la configuration de la grille.

#### Scenario: Noms de fichiers de longueurs différentes
- **WHEN** la grille affiche des vidéos avec des noms courts et longs mélangés
- **THEN** toutes les cards de la ligne ont exactement la même hauteur (qu'elles soient en mode visuel ou compact)
- **THEN** les noms longs sont tronqués avec `…` et ne font pas grandir la card

#### Scenario: Nombre de colonnes configuré à 4
- **WHEN** la configuration de la grille est 4 colonnes
- **THEN** la grille CSS affiche exactement 4 colonnes

#### Scenario: Mode Compact activé
- **WHEN** `thumbnailsEnabled` vaut `false`
- **THEN** toutes les cards adoptent la classe `.compact` avec une hauteur fixe de 100px
- **THEN** les éléments d'images miniatures sont absents ou masqués

#### Scenario: Mode Visuel activé
- **WHEN** `thumbnailsEnabled` vaut `true`
- **THEN** toutes les cards adoptent la classe `.visual`
- **THEN** les images de miniatures pointent vers `/api/videos/thumbnail/:key` et sont chargées de manière différée (lazy-loaded)
