# Spec: Random Shuffle

## Purpose

Définit le comportement du mode d'affichage aléatoire : sélection backend, contrôles UI et interaction avec les autres fonctionnalités.

## Requirements

### Requirement: Paramètre shuffle sur l'API de listing
L'API `GET /api/videos` SHALL accepter un paramètre `shuffle=true`. Lorsqu'il est présent, le système SHALL retourner exactement `pageSize` vidéos sélectionnées aléatoirement parmi la liste filtrée (après application du filtre `search`). La réponse SHALL indiquer `pagination.totalPages: 1` et `pagination.page: 1`. Si la liste filtrée contient moins d'éléments que `pageSize`, tous les éléments sont retournés dans un ordre aléatoire. Chaque appel avec `shuffle=true` produit un tirage indépendant.

#### Scenario: Tirage aléatoire standard
- **WHEN** le client soumet `GET /api/videos?shuffle=true&pageSize=18`
- **THEN** la réponse contient au plus 18 vidéos dans un ordre aléatoire
- **THEN** `pagination.totalPages` vaut 1
- **THEN** `pagination.page` vaut 1

#### Scenario: Tirage avec filtre search actif
- **WHEN** le client soumet `GET /api/videos?shuffle=true&search=vacation&pageSize=18`
- **THEN** la sélection aléatoire s'effectue uniquement parmi les vidéos dont la clé contient "vacation"

#### Scenario: Catalogue filtré plus petit que pageSize
- **WHEN** le filtre `search` réduit la liste à 5 vidéos et `pageSize=18`
- **THEN** les 5 vidéos sont retournées dans un ordre aléatoire

#### Scenario: Paramètre shuffle absent
- **WHEN** le client soumet `GET /api/videos` sans paramètre `shuffle`
- **THEN** le comportement de pagination normal est appliqué (inchangé)

### Requirement: Bouton d'activation du mode aléatoire
L'interface SHALL afficher un bouton 🔀 dans la toolbar, à côté du champ de recherche et du bouton ⚙. Ce bouton SHALL basculer le mode aléatoire actif/inactif. Lorsqu'il est actif, le bouton SHALL être visuellement distingué (fond coloré). Lorsque le mode est activé ou désactivé, la liste SHALL être rechargée immédiatement.

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

### Requirement: Bouton Nouveau tirage
En mode aléatoire actif, l'interface SHALL afficher un bouton "🔀 Nouveau tirage" dans la zone de pagination. Ce bouton SHALL déclencher un nouveau tirage aléatoire (nouvel appel API avec `shuffle=true`) sans désactiver le mode aléatoire.

#### Scenario: Clic sur Nouveau tirage
- **WHEN** le mode aléatoire est actif et l'utilisateur clique sur "🔀 Nouveau tirage"
- **THEN** un nouvel ensemble de vidéos aléatoires est affiché
- **THEN** le mode aléatoire reste actif

### Requirement: Compatibilité avec la recherche
Le mode aléatoire SHALL fonctionner conjointement avec le filtre de recherche. Lorsqu'un terme de recherche est actif, le tirage aléatoire SHALL s'effectuer parmi les vidéos correspondant à ce terme.

#### Scenario: Recherche active puis activation du shuffle
- **WHEN** l'utilisateur a filtré par "vacation" et active le mode aléatoire
- **THEN** le tirage s'effectue parmi les vidéos contenant "vacation"
- **THEN** une nouvelle recherche pendant le mode shuffle déclenche un nouveau tirage dans les nouveaux résultats
