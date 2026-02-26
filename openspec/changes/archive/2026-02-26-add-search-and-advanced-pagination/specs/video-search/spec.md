# Spec: Video Search

## Purpose

Définit le comportement du filtrage des vidéos par nom de fichier, côté API et côté UI.

## ADDED Requirements

### Requirement: Filtrage par nom de fichier via paramètre search
L'API SHALL accepter un paramètre de requête `search` (chaîne libre) sur `GET /api/videos`. Lorsqu'il est présent et non vide, le système SHALL retourner uniquement les vidéos dont la clé S3 contient la valeur de `search`, de manière insensible à la casse. Les champs `totalVideos` et `totalPages` SHALL refléter le nombre de vidéos correspondant au filtre, pas le total du bucket.

#### Scenario: Recherche avec correspondance
- **WHEN** l'utilisateur soumet `GET /api/videos?search=vacation`
- **THEN** la réponse contient uniquement les vidéos dont la clé S3 contient "vacation" (insensible à la casse)
- **THEN** `pagination.totalVideos` indique le nombre de vidéos filtrées
- **THEN** `pagination.totalPages` est calculé sur la base des vidéos filtrées

#### Scenario: Recherche insensible à la casse
- **WHEN** l'utilisateur soumet `GET /api/videos?search=VACATION`
- **THEN** la réponse contient les mêmes vidéos que pour `search=vacation`

#### Scenario: Recherche sans résultat
- **WHEN** l'utilisateur soumet `GET /api/videos?search=xyznotexist`
- **THEN** la réponse contient un tableau `videos` vide
- **THEN** `pagination.totalVideos` est 0 et `pagination.totalPages` est 0

#### Scenario: Paramètre search absent ou vide
- **WHEN** l'utilisateur soumet `GET /api/videos` sans paramètre `search`, ou avec `search=`
- **THEN** la réponse contient toutes les vidéos du bucket (comportement inchangé)

### Requirement: Champ de recherche dans l'interface utilisateur
L'interface SHALL afficher un champ de saisie texte permettant à l'utilisateur de saisir un terme de recherche. La requête vers l'API SHALL être déclenchée 300 ms après la dernière frappe (debounce). Une nouvelle recherche SHALL réinitialiser la pagination à la page 1. Le terme de recherche SHALL être reflété dans le paramètre `search` de l'URL courante.

#### Scenario: Saisie d'un terme de recherche
- **WHEN** l'utilisateur saisit "vacation" dans le champ de recherche
- **THEN** après 300 ms sans nouvelle frappe, la liste des vidéos est mise à jour avec les résultats filtrés
- **THEN** l'URL passe à `?page=1&search=vacation`

#### Scenario: Effacement du champ de recherche
- **WHEN** l'utilisateur vide le champ de recherche
- **THEN** après 300 ms, toutes les vidéos sont à nouveau affichées
- **THEN** le paramètre `search` est retiré de l'URL

#### Scenario: Chargement de page avec search dans l'URL
- **WHEN** l'utilisateur charge la page avec `?page=2&search=vacation` dans l'URL
- **THEN** le champ de recherche est pré-rempli avec "vacation"
- **THEN** la page 2 des résultats filtrés est affichée
