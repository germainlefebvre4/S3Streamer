## Why

L'API S3 `ListObjectsV2` retourne au maximum 1000 objets par appel. Le contrôleur actuel ignore le flag `IsTruncated` et le `NextContinuationToken`, ce qui tronque silencieusement la liste quand le bucket contient plus de 1000 fichiers. L'interface affiche donc un nombre de pages plafonné, cachant les vidéos au-delà de ce seuil.

## What Changes

- Le backend récupère l'intégralité des objets S3 en suivant la pagination S3 (continuation tokens) jusqu'à ce que `IsTruncated` soit `false`.
- La pagination UI (Previous / Next) continue de fonctionner de la même façon, mais reflète désormais le catalogue complet.

## Capabilities

### New Capabilities
<!-- Aucune nouvelle capability : comportement existant corrigé -->

### Modified Capabilities
- `video-listing`: La récupération des vidéos doit désormais parcourir toutes les pages S3 (continuation tokens) plutôt que de se limiter au premier batch de 1000 objets.

## Impact

- `src/controllers/videoController.js` : boucle sur `ListObjectsV2Command` avec `NextContinuationToken` jusqu'à `IsTruncated === false`.
- Aucun changement d'API REST ni de contrat de réponse JSON.
- Temps de réponse potentiellement plus long pour les très grands buckets (> 1000 objets) — acceptable car l'opération est déjà asynchrone.
