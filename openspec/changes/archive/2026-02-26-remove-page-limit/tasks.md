## 1. Implémentation backend

- [x] 1.1 Remplacer l'appel unique `ListObjectsV2Command` par une boucle do/while qui suit `NextContinuationToken` jusqu'à `IsTruncated === false` dans `src/controllers/videoController.js`
- [x] 1.2 Protéger chaque itération de la boucle contre `Contents` undefined (utiliser `?? []`)
- [x] 1.3 Supprimer le commentaire `// Get a large number to filter locally` et l'option `MaxKeys: 1000` ou la conserver à 1000 par batch (valeur maximale autorisée par S3)

## 2. Vérification

- [x] 2.1 Vérifier que la réponse JSON `/api/videos` contient le bon `totalVideos` et `totalPages` pour un bucket avec plus de 1000 objets (ou simuler avec un mock)
- [x] 2.2 Vérifier que la navigation Previous / Next fonctionne jusqu'à la dernière page
