# Spec: Grid Config

## Purpose

Définit le comportement de la modale de configuration de la grille vidéo : choix du nombre de colonnes et de lignes, persistance et application à la grille et à la pagination.

## Requirements

### Requirement: Bouton d'accès à la configuration de la grille
L'interface SHALL afficher un bouton de configuration (⚙) permettant d'ouvrir la modale de paramétrage de la grille. Ce bouton SHALL être visible en permanence sur la page principale.

#### Scenario: Clic sur le bouton de configuration
- **WHEN** l'utilisateur clique sur le bouton ⚙
- **THEN** la modale de configuration de la grille s'affiche

### Requirement: Modale de configuration colonnes et lignes
La modale SHALL proposer deux sélecteurs : le nombre de colonnes (valeurs entières de 1 à 8) et le nombre de lignes par page (valeurs entières de 1 à 6). La modale SHALL afficher les valeurs courantes pré-sélectionnées à l'ouverture. La modale SHALL comporter un bouton "Appliquer" et un bouton "Annuler".

#### Scenario: Ouverture de la modale avec config existante
- **WHEN** la modale s'ouvre et qu'une config est déjà enregistrée
- **THEN** les sélecteurs affichent les valeurs persistées (colonnes et lignes)

#### Scenario: Ouverture de la modale sans config préalable
- **WHEN** la modale s'ouvre pour la première fois (aucune config en localStorage)
- **THEN** les sélecteurs affichent les valeurs par défaut : 6 colonnes, 3 lignes

#### Scenario: Clic sur Annuler
- **WHEN** l'utilisateur clique sur "Annuler"
- **THEN** la modale se ferme sans modifier la configuration ni recharger la grille

#### Scenario: Clic sur Appliquer
- **WHEN** l'utilisateur sélectionne 4 colonnes et 2 lignes puis clique "Appliquer"
- **THEN** la modale se ferme
- **THEN** la grille affiche 4 colonnes
- **THEN** `pageSize` passe à 8 (4 × 2)
- **THEN** la liste est rechargée à la page 1 avec ce nouveau `pageSize`

### Requirement: Persistance de la configuration en localStorage
La configuration SHALL être sauvegardée dans `localStorage` à la clé `s3streamer_grid_config` sous la forme `{ "cols": N, "rows": N }` lors de chaque application. Au chargement de la page, la configuration persistée SHALL être lue et appliquée. En l'absence de config valide, les valeurs par défaut (6 colonnes, 3 lignes) SHALL être utilisées.

#### Scenario: Rechargement de page après configuration
- **WHEN** l'utilisateur a configuré 4 colonnes / 2 lignes et recharge la page
- **THEN** la grille affiche 4 colonnes et `pageSize` vaut 8

#### Scenario: Valeur localStorage absente ou corrompue
- **WHEN** la valeur en localStorage est absente, null ou non parseable en JSON valide
- **THEN** le système utilise les valeurs par défaut : 6 colonnes, 3 lignes
