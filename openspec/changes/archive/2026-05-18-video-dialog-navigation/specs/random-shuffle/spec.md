## MODIFIED Requirements

### Requirement: Bouton d'activation du mode aléatoire
L'interface SHALL afficher un bouton 🔀 dans la toolbar, à côté du champ de recherche et du bouton ⚙. Ce bouton SHALL basculer le mode aléatoire actif/inactif. Lorsqu'il est actif, le bouton SHALL être visuellement distingué (fond coloré). Lorsque le mode est activé ou désactivé, la liste SHALL être rechargée immédiatement. Lorsque le mode aléatoire est actif et qu'un dialog vidéo est ouvert, la navigation latérale (flèches ← ►) SHALL suivre l'ordre aléatoire du buffer courant ; aucune page supplémentaire ne sera chargée au-delà du buffer initial (l'API retourne `totalPages: 1` en mode shuffle).

#### Scenario: Activation du mode aléatoire
- **WHEN** l'utilisateur clique sur le bouton 🔀 (mode inactif)
- **THEN** le bouton prend l'apparence active
- **THEN** la liste est rechargée avec un tirage aléatoire
- **THEN** les contrôles de pagination sont remplacés par un bouton "🔀 Nouveau tirage"

#### Scenario: Désactivation du mode aléatoire
- **WHEN** l'utilisateur clique sur le bouton 🔀 actif
- **THEN** le bouton reprend son apparence normale
- **THEN** la liste est rechargée en mode pagination normal
- **THEN** les contrôles de pagination normaux sont restaurés

#### Scenario: Navigation dans le dialog en mode shuffle
- **WHEN** le mode shuffle est actif et un dialog vidéo est ouvert
- **THEN** les flèches de navigation suivent l'ordre aléatoire affiché dans le buffer
- **THEN** la flèche droite est désactivée à la dernière vidéo du buffer (pas de chargement cross-page)
