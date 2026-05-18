## Context

Le dialog vidéo actuel (`openVideoDialog`) est une fonction stateless : il reçoit une URL et un titre, affiche le player, et ne conserve aucun lien avec la liste de vidéos depuis laquelle il a été ouvert. La grille est entièrement reconstruite à chaque `fetchVideos(page)`, et les vidéos ne sont pas conservées en dehors du rendu DOM.

Pour implémenter la navigation, le dialog doit devenir stateful : il doit connaître sa position dans une liste, et savoir comment étendre cette liste au besoin.

## Goals / Non-Goals

**Goals:**
- Navigation ← → dans le dialog, cross-page, sans affecter la grille
- Buffer autonome géré par le dialog (indépendant de `currentPage` de la grille)
- Gestion du mode shuffle : ordre stable dans le buffer, bouton re-roll
- Keyboard : `Ctrl+←` / `Ctrl+→` pour la navigation vidéo, `←` / `→` pour le seek natif, `Escape` pour fermer
- Chargement de la page suivante au clic sur la flèche si besoin (non spéculatif)
- Bouton 🎲 visible en permanence, actif en mode shuffle uniquement

**Non-Goals:**
- Modification de l'API backend
- Navigation circulaire (pas de wrap autour)
- Préchargement vidéo (pas de `<link rel=preload>`)
- Mise à jour de la grille lors de la navigation dans le dialog

## Decisions

### D1 — Buffer sous forme de tableau plat + map de pages chargées

**Décision** : Maintenir `dialogBuffer = []` (tableau de vidéos dans l'ordre de navigation) et `dialogLoadedPages = Set` (pages déjà chargées). Un `dialogAbsoluteIndex` pointe la vidéo courante.

**Pourquoi pas un Map `page → videos[]`** : Accéder à une vidéo par index absolu nécessiterait de recalculer `Math.floor(index / pageSize)` à chaque fois. Le tableau plat est plus simple et les vidéos s'ajoutent naturellement en fin (ou en début pour la navigation arrière).

**Pourquoi pas une recharge complète** : Recharger toutes les pages au clic serait lent et perturbant. Le buffer croît paresseusement.

### D2 — Chargement de la page suivante au moment du clic (lazy, non spéculatif)

**Décision** : Quand `dialogAbsoluteIndex === dialogBuffer.length - 1` et qu'il reste des pages, le clic ▶ déclenche un fetch de la page suivante avant de naviguer. Un état `isLoadingNextPage` bloque les clics doubles.

**Pourquoi pas de pré-chargement** : Complexité inutile. La latence d'une requête API locale est imperceptible dans la plupart des cas. Si le fetch est rapide (< 100 ms), la navigation est transparente ; sinon, le bouton affiche brièvement un spinner.

**Pourquoi pas de chargement de la page précédente** : En mode normal (non-shuffle), les pages précédentes sont déjà dans le buffer (l'utilisateur a forcément traversé ces vidéos pour arriver là). Exception : si le dialog est ouvert sur la première vidéo d'une page > 1, on ne charge pas la page précédente (bord gauche désactivé).

### D3 — Contexte du buffer capturé à l'ouverture du dialog

**Décision** : À l'ouverture du dialog, on capture `{ searchQuery, shuffleMode, pageSize }` comme contexte immuable pour tous les fetches ultérieurs du buffer. La grille peut changer (nouvelle recherche, changement de config) sans affecter le dialog en cours.

**Pourquoi** : Cohérence — l'utilisateur navigue dans la liste qu'il voyait au moment du clic, pas dans une liste qui aurait pu changer entre-temps.

### D4 — Mode shuffle : buffer stable, re-roll via bouton 🎲

**Décision** : En mode shuffle, le buffer est stable une fois chargé (la page 1 aléatoire ne change pas si on revient en arrière). Le bouton 🎲 vide le buffer, refetch avec `shuffle=true`, et ouvre la première vidéo du nouveau tirage.

**Pourquoi pas de navigation "infinie aléatoire"** : L'utilisateur a dit que les flèches suivent l'ordre affiché. Garder le buffer stable est donc la bonne sémantique. Le re-roll explicite est distinct.

**Mode shuffle — cross-page** : En shuffle, l'API retourne `totalPages: 1`. Donc la navigation ← → en mode shuffle n'atteindra jamais une page suivante (le buffer = la page 1). Le bouton 🎲 est le seul moyen d'obtenir de nouvelles vidéos.

### D5 — Bouton 🎲 toujours présent dans le DOM, conditionnel visuellement

**Décision** : Le bouton est toujours dans le HTML du dialog. En dehors du mode shuffle, il est `disabled` et visuellement atténué (non masqué). En mode shuffle, il est pleinement actif.

**Pourquoi** : Évite les sauts de layout à l'activation du mode shuffle. L'utilisateur découvre la fonctionnalité même hors shuffle.

### D6 — Keyboard : Ctrl+Arrow pour la navigation, Arrow seul pour le seek

**Décision** : L'écouteur `keydown` vérifie `event.ctrlKey` pour distinguer la navigation vidéo du seek natif du `<video>`. Sans `Ctrl`, les flèches sont laissées au comportement par défaut du navigateur (seek ±5s dans la vidéo).

**Pourquoi** : Conserver le comportement natif du player est important pour l'UX. `Ctrl+←/→` est un raccourci non-conflictuel.

### D7 — Design des boutons nav : zones pleine hauteur style Netflix

**Décision** : Deux `<button>` positionnés `absolute` sur les côtés du dialog (pas de la vidéo), `top: 0 / height: 100%`, `width: 10% (min 60px)`. Gradient radial de la bordure vers le centre. Chevrons SVG fins. `opacity: 0.25` au repos, `1` au hover. `pointer-events: none` + `opacity: 0` quand disabled.

**Pourquoi pas en overlay sur la vidéo** : Les boutons en overlay masquent une partie de l'image et créent une expérience "popup dans popup". Les zones latérales du dialog (fond noir) sont la zone naturelle Netflix.

## Risks / Trade-offs

- **[Risk] Buffer mémoire en navigation longue** → Mitigation : pas de limite stricte nécessaire pour un usage normal (quelques centaines de vidéos max). Acceptable pour l'instant.
- **[Risk] Désynchronisation buffer/grille** → Mitigation : assumé par conception (D3). À documenter dans le comportement utilisateur.
- **[Risk] `Ctrl+←` conflit avec navigation browser** → Mitigation : `event.preventDefault()` sur `Ctrl+←/→` uniquement quand le dialog est ouvert.
- **[Risk] Mode shuffle cross-page** → Pas de risque réel : l'API retourne `totalPages: 1` en shuffle, donc le buffer ne grandira pas au-delà de la page initiale. Les flèches se désactivent naturellement aux bords.
