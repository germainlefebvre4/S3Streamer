## Context

S3Streamer est une application vanilla HTML/JS + Express.js sans authentification, utilisée en local. Le video-dialog affiche une vidéo en plein écran avec navigation prev/next et un bouton fermer dans le header. Le backend utilise un cache mémoire (`cachedContents`) pour éviter des appels répétés à S3.

Actuellement, aucune route d'écriture n'existe : toutes les routes sont `GET`. Le SDK AWS `@aws-sdk/client-s3` est déjà installé et le client S3 est déjà initialisé dans `videoController.js`.

## Goals / Non-Goals

**Goals:**
- Permettre la suppression d'une vidéo depuis le dialog avec confirmation
- Maintenir la cohérence entre dialogBuffer, grille et cache backend après suppression
- Rester dans le style et les patterns existants (modal custom, pas de librairies additionnelles)

**Non-Goals:**
- Authentification / autorisation (usage local uniquement)
- Corbeille ou soft-delete
- Suppression en masse
- Suppression depuis la grille directement (sans ouvrir le dialog)

## Decisions

### Bouton dans le dialog header

**Décision** : Bouton `🗑` placé dans `.video-dialog-header`, entre le titre et le bouton fermer.

**Alternatives considérées** :
- Sous le player (à côté du shuffle) : moins risqué mais moins visible et peu naturel
- Sur la card dans la grille : hors scope, nécessite une hover state complexe

**Raison** : La zone header est l'endroit naturel pour les actions liées à l'élément affiché. Le bouton fermer y est déjà, les deux actions (supprimer / fermer) forment une paire cohérente.

---

### Modal de confirmation custom

**Décision** : Modal custom réutilisant le pattern `config-modal-overlay` existant, affichant le nom exact de la vidéo.

**Alternatives considérées** :
- `window.confirm()` natif : rapide mais hors thème et ne permet pas d'afficher le nom proprement en gras

**Raison** : Afficher `Supprimer définitivement « nom_du_fichier.mp4 » ?` dans un modal stylé réduit l'ambiguïté et s'intègre visuellement.

---

### Navigation post-suppression

**Décision** : Après suppression, priorité à la vidéo suivante dans le buffer ; si absente, vidéo précédente ; si seule, fermeture du dialog.

```
Vidéo suivante disponible  →  naviguer vers la suivante
Pas de suivante, précédente dispo  →  naviguer vers la précédente
Seule vidéo  →  fermer le dialog
```

**Raison** : Avancer vers la suivante est le comportement le plus naturel (l'utilisateur "continue" son tri). Reculer seulement en dernier recours.

---

### Invalidation chirurgicale du cache

**Décision** : Après suppression S3 réussie, retirer uniquement l'objet supprimé de `cachedContents` (comparaison par `Key`) au lieu de purger tout le cache.

**Alternatives considérées** :
- Purge totale (`cacheExpiresAt = 0`) : simple mais force un re-fetch S3 complet, coûteux si le bucket est grand
- Pas de maj du cache : incohérence jusqu'à expiration du TTL

**Raison** : L'opération chirurgicale maintient la cohérence sans pénalité de performance. Le `Key` est unique dans S3.

---

### Synchronisation avec la grille

**Décision** : Après suppression réussie, retirer la card DOM correspondante immédiatement (sans recharger la liste).

**Raison** : La grille est visible en arrière-plan du dialog. L'incohérence visuelle serait déstabilisante. Un re-fetch complet de la page serait trop coûteux.

## Risks / Trade-offs

- [Risque] La suppression S3 est irréversible → Mitigation : modal de confirmation affichant le nom exact du fichier
- [Risque] Un `Key` S3 contenant des caractères spéciaux peut poser des problèmes d'encodage dans l'URL → Mitigation : utiliser `encodeURIComponent` côté frontend, `decodeURIComponent` côté backend (pattern déjà en place pour `/stream/:key`)
- [Trade-off] La card est retirée du DOM mais le `totalVideos` côté pagination n'est pas mis à jour → Acceptable : l'utilisateur ne voit pas la pagination changer en temps réel, et un rechargement de page ou changement de page corrigera l'affichage
