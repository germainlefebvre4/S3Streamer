## 1. Backend Implementation

- [x] 1.1 Extraire le paramètre de requête `sort` (valeur par défaut : `name_asc`) dans le contrôleur `src/controllers/videoController.js`.
- [x] 1.2 Implémenter la logique de tri sur la liste `filteredVideos` en mémoire (avant le découpage de pagination) selon les différentes options : `name_asc`, `name_desc`, `date_desc`, `size_desc`.
- [x] 1.3 Assurer la stabilité du tri en prévoyant des valeurs par défaut pour les objets S3 manquants (propriétés `Size` ou `LastModified` indéfinies).

## 2. Frontend UI & Layout

- [ ] 2.1 Ajouter l'élément `<select id="sort-select" class="sort-select">` dans la toolbar de `src/public/index.html`, contenant les 4 options de tri en français.
- [ ] 2.2 Ajouter les styles CSS pour `.sort-select` afin de s'assurer qu'il s'aligne visuellement avec le champ de recherche et les boutons de configuration (hauteur, bordures, couleurs, et styles pour l'état `:disabled`).

## 3. Frontend Sorting & State Logic

- [ ] 3.1 Initialiser et synchroniser la variable d'état global `currentSort` (valeur par défaut : `'name_asc'`).
- [ ] 3.2 Gérer l'extraction initiale du paramètre `sort` de l'URL au chargement de la page et appliquer la valeur correspondante au sélecteur `sort-select`.
- [ ] 3.3 Ajouter un écouteur d'événement `change` sur `sort-select` pour mettre à jour `currentSort`, désactiver le mode aléatoire si actif, et recharger les vidéos depuis la page 1.
- [ ] 3.4 Mettre à jour `updateURLWithPage` (renommée en `updateURLWithParams`) pour qu'elle synchronise l'URL du navigateur avec la valeur de `currentSort` (sauf en mode par défaut ou shuffle).

## 4. Integration & Synergy

- [ ] 4.1 Désactiver visuellement le sélecteur `sort-select` lors de l'activation du mode shuffle et le réactiver lorsqu'il est désactivé.
- [ ] 4.2 Inclure le paramètre `sort` dans les requêtes de pagination émises par le frontend (`fetchVideos`).
- [ ] 4.3 Mettre à jour la logique de navigation dans le dialogue vidéo (`navigateDialog` / `openVideoDialog`) pour inclure l'état du tri (`sortOption`) dans `dialogContext` et précharger la page suivante en conservant le tri d'origine.

## 5. Verification

- [ ] 5.1 Vérifier que le tri par défaut (A-Z) et le tri inverse (Z-A) ordonnent correctement les vidéos.
- [ ] 5.2 Vérifier que le tri par date de modification remonte bien les fichiers les plus récents.
- [ ] 5.3 Vérifier que le tri par taille ordonne correctement les vidéos par volume.
- [ ] 5.4 Vérifier la synchronisation de l'URL lors du changement de tri et l'exclusivité mutuelle entre le tri et le mode shuffle.
- [ ] 5.5 Vérifier la cohérence de la navigation dans le modal dialog (y compris le chargement cross-page) avec le tri actif.
