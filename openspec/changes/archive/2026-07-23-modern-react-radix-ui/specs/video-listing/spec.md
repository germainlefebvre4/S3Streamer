## MODIFIED Requirements

### Requirement: Apparence uniforme des cards vidéo
Les cards vidéo SHALL être construites en React et stylisées avec Tailwind CSS. Elles SHALL avoir une hauteur fixe, indépendante de la longueur du nom de fichier. Le nom de fichier SHALL être tronqué avec points de suspension si sa longueur dépasse la largeur de la card. Les métadonnées (taille, date) SHALL être alignées en bas de la card. Le nombre de colonnes de la grille SHALL correspondre à la valeur configurée dans la configuration de la grille, et utiliser des classes de grille Tailwind réactives. Un effet de survol (hover) doux avec bordure lumineuse (glow) et zoom léger SHALL être appliqué.

#### Scenario: Noms de fichiers de longueurs différentes
- **WHEN** la grille affiche des vidéos avec des noms courts et longs mélangés
- **THEN** toutes les cards ont la même hauteur et le même style sombre uniforme
- **THEN** les noms longs sont tronqués avec `…` et ne modifient pas les dimensions de la card

#### Scenario: Nombre de colonnes configuré à 4
- **WHEN** la configuration de la grille est de 4 colonnes
- **THEN** la grille CSS Tailwind affiche exactement 4 colonnes sur les écrans larges
