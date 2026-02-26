## Why

L'interface actuelle ne propose aucun moyen de rechercher une vidéo par nom, et la navigation entre les pages se limite à deux boutons Previous / Next. Avec un bucket contenant plusieurs dizaines ou centaines de vidéos, retrouver un fichier spécifique ou accéder rapidement à une page précise devient fastidieux.

## What Changes

- Un champ de recherche est ajouté en haut de la liste pour filtrer les vidéos par nom de fichier (filtrage côté backend).
- La pagination évolue : en plus de Previous / Next, des numéros de pages cliquables sont affichés, avec une fenêtre glissante centrée sur la page courante et des points de suspension (`…`) pour les grandes plages.
- L'API backend accepte deux nouveaux paramètres : `search` (texte libre, insensible à la casse) et `pageSize` (nombre de résultats par page, avec valeur par défaut conservée à 18).
- La page courante est remise à 1 automatiquement lors d'une nouvelle recherche.

## Capabilities

### New Capabilities
- `video-search` : Filtrage des vidéos par nom de fichier via un paramètre `search` côté API et un champ texte côté UI.

### Modified Capabilities
- `video-listing` : La pagination passe de Previous / Next uniquement à une navigation numérotée avec fenêtre glissante (ex. `1 … 4 5 [6] 7 8 … 20`).

## Impact

- `src/controllers/videoController.js` : filtrage insensible à la casse sur `video.key` selon le paramètre `search`; le paramètre `pageSize` devient configurable via query string.
- `src/public/index.html` : ajout du champ de recherche, refonte de la fonction `updatePagination()` pour générer des boutons numérotés avec ellipses.
- Contrat de réponse JSON inchangé (les champs `pagination.*` existants sont conservés).
- Aucune nouvelle dépendance.
