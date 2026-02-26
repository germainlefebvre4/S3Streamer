## 1. Backend — Filtrage par recherche

- [x] 1.1 Ajouter la lecture du paramètre `search` depuis `req.query` dans `listVideos` (`videoController.js`)
- [x] 1.2 Appliquer le filtre insensible à la casse sur `video.Key` après la récupération complète des objets S3 et le filtre par extension
- [x] 1.3 Vérifier que `totalVideos`, `totalPages` et `paginatedVideos` sont calculés sur la liste filtrée

## 2. Frontend — Champ de recherche

- [x] 2.1 Ajouter un champ `<input type="text">` de recherche dans le HTML, au-dessus de la grille de vidéos
- [x] 2.2 Pré-remplir le champ avec la valeur du paramètre `search` de l'URL au chargement de la page
- [x] 2.3 Implémenter le debounce (300 ms) sur l'événement `input` du champ de recherche
- [x] 2.4 Appeler `fetchVideos(1)` (reset page 1) avec le terme de recherche courant lors du déclenchement
- [x] 2.5 Inclure `search` dans l'URL query string lors des mises à jour d'URL (et le supprimer si vide)
- [x] 2.6 Passer `search` comme paramètre à `GET /api/videos` dans la fonction `fetchVideos`

## 3. Frontend — Pagination numérotée

- [x] 3.1 Réécrire `updatePagination()` pour générer des boutons numérotés avec fenêtre glissante (2 pages de chaque côté de la page courante)
- [x] 3.2 Toujours afficher le bouton de la première et de la dernière page
- [x] 3.3 Ajouter les points de suspension (`…`) entre les blocs non contigus
- [x] 3.4 Appliquer un style visuel distinct (ex. surbrillance) sur le bouton de la page courante
- [x] 3.5 Conserver les boutons Previous et Next fonctionnels avec leur état désactivé aux bornes
- [x] 3.6 Gérer le cas `totalPages <= 5` : afficher tous les numéros sans ellipses
- [x] 3.7 Inclure `search` dans l'URL mise à jour lors du clic sur un numéro de page

## 4. Vérification

- [x] 4.1 Tester le filtrage backend : résultats avec correspondance, sans correspondance, param absent
- [x] 4.2 Tester le debounce UI : vérifier qu'une seule requête est envoyée après frappe rapide
- [x] 4.3 Tester la pagination numérotée sur un résultat avec > 5 pages (vérifier les ellipses)
- [x] 4.4 Tester le rechargement de page avec `?page=3&search=test` dans l'URL
- [x] 4.5 Vérifier que la recherche remet bien la pagination à la page 1
