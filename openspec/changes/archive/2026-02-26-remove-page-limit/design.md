## Context

`videoController.js` appelle `ListObjectsV2Command` avec `MaxKeys: 1000` et ignore `IsTruncated` / `NextContinuationToken`. L'API S3 retournant au plus 1000 objets par appel, tout bucket de plus de 1000 fichiers est silencieusement tronqué. La pagination UI (`page`, `totalPages`) est calculée à partir du sous-ensemble reçu, ce qui masque les vidéos au-delà du seuil.

## Goals / Non-Goals

**Goals:**
- Récupérer la totalité des objets S3 en suivant la pagination interne S3 (continuation tokens).
- Conserver le contrat de réponse JSON existant (aucun changement d'API REST).

**Non-Goals:**
- Cache ou optimisation réseau pour les très grands buckets.
- Pagination server-side avec curseur exposé au frontend.
- Modification de l'interface utilisateur.

## Decisions

### Boucle sur les continuation tokens (vs augmenter MaxKeys)

`MaxKeys` est plafonné à 1000 par S3 — le passer à une valeur supérieure n'a aucun effet. La seule solution correcte est de boucler sur `ListObjectsV2Command` en réutilisant `NextContinuationToken` tant que `IsTruncated === true`.

```
let allObjects = []
let continuationToken = undefined
do {
  const response = await s3Client.send(new ListObjectsV2Command({
    Bucket, Prefix, MaxKeys: 1000,
    ContinuationToken: continuationToken
  }))
  allObjects.push(...(response.Contents ?? []))
  continuationToken = response.NextContinuationToken
} while (response.IsTruncated)
```

**Alternative écartée** : pagination server-side exposée au frontend (curseur S3). Complexifie l'API et le frontend sans bénéfice pour le cas d'usage actuel.

### Filtrage après collecte complète

Le filtrage par extension vidéo est conservé après la collecte complète, identiquement à l'implémentation actuelle.

## Risks / Trade-offs

- **Latence accrue pour les très grands buckets** → Acceptable : opération déjà asynchrone, impact invisible pour des buckets < 5 000 objets (5 appels S3). Pour des buckets de plusieurs dizaines de milliers d'objets, envisager un cache en mémoire (hors scope).
- **Consommation mémoire** → Tableau de métadonnées S3 (pas les binaires) ; 10 000 objets ≈ quelques Mo, négligeable.
- **Régression si `Contents` est undefined** → Déjà géré par `Contents?.filter(...)` ; la boucle doit aussi protéger chaque itération avec `?? []`.

## Migration Plan

1. Modifier uniquement `src/controllers/videoController.js`.
2. Aucun changement de schema de base de données, d'API REST ou de frontend.
3. Rollback : revenir au commit précédent sur ce fichier.
