## 1. Backend Implementation

- [x] 1.1 Extraire le paramètre de requête `sort` (valeur par défaut : `name_asc`) dans le contrôleur `src/controllers/videoController.js`.
- [x] 1.2 Implémenter la logique de tri sur la liste `filteredVideos` en mémoire (avant le découpage de pagination) selon les différentes options : `name_asc`, `name_desc`, `date_desc`, `size_desc`.
- [x] 1.3 Assurer la stabilité du tri en prévoyant des valeurs par défaut pour les objets S3 manquants (propriétés `Size` ou `LastModified` indéfinies).

## 2. Frontend UI & Layout

- [x] 2.1 Ajouter l'élément `<select id="sort-select" class="sort-select">` dans la toolbar de `src/public/index.html`, contenant les 4 options de tri en français.
- [x] 2.2 Ajouter les styles CSS pour `.sort-select` afin de s'assurer qu'il s'aligne visuellement avec le champ de recherche et les boutons de configuration (hauteur, bordures, couleurs, et styles pour l'état `:disabled`).

## 3. Frontend Sorting & State Logic

- [x] 3.1 Initialiser et synchroniser la variable d'état global `currentSort` (valeur par défaut : `'name_asc'`).
- [x] 3.2 Gérer l'extraction initiale du paramètre `sort` de l'URL au chargement de la page et appliquer la valeur correspondante au sélecteur `sort-select`.
- [x] 3.3 Ajouter un écouteur d'événement `change` sur `sort-select` pour mettre à jour `currentSort`, désactiver le mode aléatoire si actif, et recharger les vidéos depuis la page 1.
- [x] 3.4 Mettre à jour `updateURLWithPage` (renommée en `updateURLWithParams`) pour qu'elle synchronise l'URL du navigateur avec la valeur de `currentSort` (sauf en mode par défaut ou shuffle).

## 4. Integration & Synergy

- [x] 4.1 Désactiver visuellement le sélecteur `sort-select` lors de l'activation du mode shuffle et le réactiver lorsqu'il est désactivé.
- [x] 4.2 Inclure le paramètre `sort` dans les requêtes de pagination émises par le frontend (`fetchVideos`).
- [x] 4.3 Mettre à jour la logique de navigation dans le dialogue vidéo (`navigateDialog` / `openVideoDialog`) pour inclure l'état du tri (`sortOption`) dans `dialogContext` et précharger la page suivante en conservant le tri d'origine.

## 5. Verification

- [x] 5.1 Vérifier que le tri par défaut (A-Z) et le tri inverse (Z-A) ordonnent correctement les vidéos.
- [x] 5.2 Vérifier que le tri par date de modification remonte bien les fichiers les plus récents.
- [x] 5.3 Vérifier que le tri par taille ordonne correctement les vidéos par volume.
- [x] 5.4 Vérifier la synchronisation de l'URL lors du changement de tri et l'exclusivité mutuelle entre le tri et le mode shuffle.
- [x] 5.5 Vérifier la cohérence de la navigation dans le modal dialog (y compris le chargement cross-page) avec le tri actif.
