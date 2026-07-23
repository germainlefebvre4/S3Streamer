## Context

L'application S3Streamer est structurée autour d'un backend Node.js/Express (`src/controllers/videoController.js`) qui communique avec un bucket AWS S3, et d'un frontend monopage en Vanilla JS/CSS (`src/public/index.html`). La pagination, la recherche et le mode aléatoire sont gérés côté serveur.

Cette conception décrit comment ajouter une fonctionnalité de favoris locaux persistée côté client, tout en l'intégrant proprement aux mécanismes de pagination et de recherche du serveur.

## Goals / Non-Goals

**Goals:**
- Permettre à l'utilisateur de marquer une vidéo comme favorite en cliquant sur une étoile (⭐/☆) sur sa carte ou depuis le lecteur.
- Persister l'état des favoris dans le `localStorage` du navigateur.
- Ajouter un interrupteur de filtrage rapide des favoris dans la barre d'outils.
- Maintenir une pagination, un tri aléatoire et une recherche fonctionnelle sur l'ensemble des favoris.
- Assurer une UX fluide (Option B) : un favori retiré de la liste alors que le filtre est actif reste affiché dans la grille courante pour éviter les disparitions soudaines, mais disparaît au prochain rechargement ou changement de page.

**Non-Goals:**
- Authentification des utilisateurs ou comptes multiples (les favoris sont strictement locaux).
- Base de données distante pour stocker les favoris.

## Decisions

### Décision 1 : Filtrage des favoris côté serveur (via Paramètre de Requête)
Pour éviter de casser la pagination et la recherche, le frontend enverra la liste des favoris au format JSON lors de l'appel à l'API GET `/api/videos?favorites=["key1","key2"]`.
- *Alternative considérée* : Filtrage purement frontend. Rejetée car elle brise la pagination serveur (des pages entières pourraient se retrouver vides si elles ne contiennent aucun favori).
- *Détail d'implémentation* : Le serveur filtre d'abord la liste brute d'objets S3 pour ne garder que ceux présents dans la liste de favoris reçue, puis applique la pagination et la recherche.

### Décision 2 : Option B pour le retrait de favori en mode filtré
Lorsqu'un utilisateur décoche un favori (clic sur ⭐ -> ☆) alors que le filtre favoris est actif :
- La clé est immédiatement supprimée du `localStorage` et du `Set` d'état en mémoire.
- L'icône de l'étoile devient vide (☆).
- La carte de la vidéo **reste visible** sur la grille courante. Elle disparaîtra lors du prochain fetch de vidéos (changement de page, recherche, rechargement, désactivation/réactivation du filtre).
- *Justification* : Offre une meilleure UX en empêchant la perte instantanée d'un élément par erreur de clic, tout en permettant à l'utilisateur d'annuler son action immédiatement.

### Décision 3 : Structure HTML et CSS pour le bouton favori sur les cartes
Les cartes vidéo (`.video-item`) ont un conteneur flex vertical avec `position: relative`. Nous positionnerons le bouton favori de manière absolue en haut à droite.
- *Style CSS* : 
  ```css
  .video-item {
    position: relative; /* requis pour le positionnement de l'étoile */
  }
  .favorite-card-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    z-index: 5;
    padding: 4px;
    line-height: 1;
    transition: transform 0.1s ease;
  }
  .favorite-card-btn:hover {
    transform: scale(1.2);
  }
  ```
- *Gestion d'événement* : Utilisation de `event.stopPropagation()` lors du clic sur l'étoile pour empêcher le déclenchement de l'événement click de `.video-item` (qui ouvre le lecteur).

## Risks / Trade-offs

- **[Risque] Taille maximale d'URL** : Si l'utilisateur a des milliers de vidéos favorites, la chaîne JSON passée dans `?favorites=[...]` peut dépasser les limites standard de longueur d'URL des serveurs HTTP (généralement 8 Ko).
  - *Atténuation* : Dans l'usage prévu d'un streamer personnel, le nombre de favoris dépasse rarement 100-200 éléments (soit ~4 à 6 Ko d'URL maximum pour des clés longues). Si nécessaire à l'avenir, l'API pourrait migrer vers un verbe POST, mais GET reste optimal pour conserver la cohérence avec la pagination existante.
