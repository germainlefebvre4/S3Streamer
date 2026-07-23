## Context

Le dialogue vidéo de S3Streamer prend actuellement en charge les touches `Escape` pour la fermeture et `Ctrl + Flèches` pour la navigation d'une vidéo à l'autre. Cependant, les contrôles de lecture classiques du lecteur vidéo (Espace pour pause, flèches pour le seek ou le volume, M pour muet, F pour le plein écran) ne sont pas gérés de manière globale lorsque le dialogue est ouvert. L'utilisateur doit d'abord cliquer sur l'élément vidéo pour lui donner le focus et pouvoir utiliser ces touches, ce qui nuit à l'ergonomie.

## Goals / Non-Goals

**Goals:**
- Offrir une expérience de contrôle clavier complète et naturelle (style YouTube/Netflix) dès que le dialogue vidéo est visible.
- Intercepter et standardiser les raccourcis clés : `Space` (Play/Pause), `ArrowLeft`/`ArrowRight` (Seek ±10s), `ArrowUp`/`ArrowDown` (Volume ±10%), `M` (Mute), `F` (Plein écran).
- Préserver l'accessibilité globale en évitant toute interception indésirable si un champ de texte est actif ou si une sous-modale est ouverte.

**Non-Goals:**
- Créer une interface utilisateur personnalisée d'overlay (type barre de volume personnalisée ou indicateur au milieu de l'écran). On se repose entièrement sur la mise à jour des contrôles natifs de la balise `<video>`.
- Modifier les raccourcis de navigation inter-vidéos existants (`Ctrl + Flèches`).

## Decisions

### D1 — Option A pour le Plein Écran (Touche F)
- **Décision** : Utiliser l'API Fullscreen directement sur la balise `<video>` (`videoPlayer`) au lieu du dialogue `#video-dialog`.
- **Pourquoi** : Cela offre l'expérience la plus propre et la plus robuste. En mode plein écran, le navigateur affiche automatiquement sa barre de contrôle native optimisée pour le plein écran, et gère de façon transparente les contrôles matériels et d'affichage.

### D2 — Isolation des Raccourcis et Priorité de Saisie
- **Décision** : Le listener d'événements `keydown` vérifiera systématiquement si :
  1. Le dialogue vidéo est affiché (`videoDialog.style.display === 'flex'`).
  2. Aucune autre modale n'est ouverte (`deleteModalOverlay` ou `configModalOverlay` invisibles).
  3. L'élément ayant le focus n'est pas un champ de saisie (`INPUT` ou `TEXTAREA`).
- **Pourquoi** : Évite d'intercepter la barre d'espace ou les touches directionnelles pendant une recherche ou une confirmation de suppression.

### D3 — Prévention du comportement par défaut (scroll de page)
- **Décision** : Appeler systématiquement `event.preventDefault()` sur les touches interceptées et gérées par notre script.
- **Pourquoi** : Empêche notamment la barre d'espace de faire défiler la page en arrière-plan pendant la lecture de la vidéo, ou les touches fléchées de déplacer le focus.

## Risks / Trade-offs

- **[Risk] Double déclenchement d'événements** : Si l'élément `<video>` a lui-même le focus et que l'utilisateur appuie sur Espace, le navigateur et notre script pourraient tous deux déclencher Play/Pause, annulant l'action.
  - *Mitigation* : Le fait d'utiliser `event.preventDefault()` au niveau du document arrête la propagation et la gestion native concurrente. De plus, les navigateurs modernes intègrent très bien la modification programmatique des propriétés média.
- **[Risk] Compatibilité de l'API Fullscreen** : Certains navigateurs mobiles ou anciens nécessitent des préfixes (comme `webkitRequestFullscreen`).
  - *Mitigation* : Inclure des fallbacks de compatibilité standard pour `webkit` (Safari) afin de garantir une expérience sans faille sur Mac/iOS.
