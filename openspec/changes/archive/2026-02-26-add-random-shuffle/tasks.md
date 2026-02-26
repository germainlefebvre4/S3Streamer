## 1. Backend — Shuffle aléatoire

- [x] 1.1 Lire le paramètre `shuffle` depuis `req.query` dans `listVideos` (`videoController.js`)
- [x] 1.2 Implémenter Fisher-Yates sur une copie de `filteredVideos` lorsque `shuffle=true`
- [x] 1.3 Prendre les `pageSize` premiers éléments du tableau mélangé (ou tous si moins de `pageSize`)
- [x] 1.4 Retourner `pagination.totalPages: 1`, `pagination.page: 1`, `hasNextPage: false`, `hasPrevPage: false` en mode shuffle

## 2. Frontend CSS — Bouton shuffle et état actif

- [x] 2.1 Ajouter le style `.shuffle-btn.active` (fond vert, couleur blanche) pour l'état actif du bouton 🔀

## 3. Frontend HTML — Bouton shuffle dans la toolbar

- [x] 3.1 Ajouter le bouton `<button id="shuffle-btn" class="config-btn">🔀</button>` dans la toolbar, entre le champ de recherche et le bouton ⚙

## 4. Frontend JS — État et logique shuffle

- [x] 4.1 Déclarer la variable d'état `let shuffleMode = false`
- [x] 4.2 Ajouter la référence DOM `const shuffleBtn = document.getElementById('shuffle-btn')`
- [x] 4.3 Passer `shuffle: 'true'` dans les `URLSearchParams` de `fetchVideos` quand `shuffleMode` est actif
- [x] 4.4 Implémenter le toggle au clic sur 🔀 : basculer `shuffleMode`, mettre à jour la classe `.active` du bouton, appeler `fetchVideos(1)`
- [x] 4.5 Dans `updatePagination`, si `shuffleMode` est actif : injecter uniquement un bouton "🔀 Nouveau tirage" dans `paginationElement` au lieu des contrôles habituels
- [x] 4.6 Le bouton "Nouveau tirage" appelle `fetchVideos(1)` sans modifier `shuffleMode`

## 5. Vérification

- [x] 5.1 Vérifier que chaque clic sur 🔀 produit un tirage différent
- [x] 5.2 Vérifier que la pagination est absente en mode shuffle et restaurée à la désactivation
- [x] 5.3 Vérifier que "Nouveau tirage" change les vidéos affichées sans désactiver le mode
- [x] 5.4 Vérifier que le shuffle respecte un filtre `search` actif
- [x] 5.5 Vérifier que si le catalogue filtré < `pageSize`, toutes les vidéos filtrées sont affichées
