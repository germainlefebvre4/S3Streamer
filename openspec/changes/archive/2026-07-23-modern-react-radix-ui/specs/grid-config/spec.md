## MODIFIED Requirements

### Requirement: Modale de configuration colonnes, lignes et largeur
La modale de configuration SHALL être construite à l'aide de la primitive `Radix Dialog` et de classes Tailwind CSS. Elle SHALL proposer trois sélecteurs : le nombre de colonnes (valeurs entières de 1 à 8), le nombre de lignes par page (valeurs entières de 1 à 6), et la largeur maximale de la page (valeurs : 900px, 1200px, 1400px, 1600px, 100%). La modale SHALL afficher les valeurs courantes pré-sélectionnées à l'ouverture. La modale SHALL comporter un bouton "Appliquer" et un bouton "Annuler".

#### Scenario: Ouverture de la modale avec config existante
- **WHEN** la modale s'ouvre et qu'une config est déjà enregistrée
- **THEN** les sélecteurs affichent les valeurs persistées (colonnes, lignes et largeur)

#### Scenario: Ouverture de la modale sans config préalable
- **WHEN** la modale s'ouvre pour la première fois (aucune config en localStorage)
- **THEN** les sélecteurs affichent les valeurs par défaut : 6 colonnes, 3 lignes, largeur 1200px

#### Scenario: Clic sur Annuler
- **WHEN** l'utilisateur clique sur "Annuler" ou appuie sur Escape
- **THEN** la modale se ferme sans modifier la configuration ni recharger la grille

#### Scenario: Clic sur Appliquer
- **WHEN** l'utilisateur sélectionne 4 colonnes, 2 lignes, et largeur 1400px puis clique "Appliquer"
- **THEN** la modale se ferme
- **THEN** la grille affiche 4 colonnes et ajuste sa largeur maximale à 1400px
- **THEN** `pageSize` passe à 8 (4 × 2)
- **THEN** la liste est rechargée à la page 1 avec ce nouveau `pageSize`

### Requirement: Persistance de la configuration en localStorage
La configuration SHALL être sauvegardée dans `localStorage` à la clé `s3streamer_grid_config` sous la forme `{ "cols": N, "rows": N, "width": S }` lors de chaque application. Au chargement de la page, la configuration persistée SHALL être lue et appliquée. En l'absence de config valide, les valeurs par défaut (6 colonnes, 3 lignes, 1200px) SHALL être utilisées.

#### Scenario: Rechargement de page après configuration
- **WHEN** l'utilisateur a configuré 4 colonnes / 2 lignes / 1400px et recharge la page
- **THEN** la grille affiche 4 colonnes, a une largeur de 1400px, et `pageSize` vaut 8

#### Scenario: Valeur localStorage absente ou corrompue
- **WHEN** la valeur en localStorage est absente, null ou non parseable en JSON valide
- **THEN** le système utilise les valeurs par défaut : 6 colonnes, 3 lignes, 1200px
