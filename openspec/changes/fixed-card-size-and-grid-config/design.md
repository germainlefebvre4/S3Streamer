## Context

Le frontend est en vanilla HTML/CSS/JS sans framework ni build step. La grille utilise actuellement `repeat(auto-fill, minmax(300px, 1fr))` avec des cards de hauteur auto — ce qui crée des hauteurs irrégulières selon la longueur des noms de fichiers. La valeur par défaut du `pageSize` est 18 (3 lignes × 6 colonnes implicites). Le backend accepte déjà `pageSize` en query param.

## Goals / Non-Goals

**Goals:**
- Cards de hauteur fixe avec troncature du nom de fichier et alignement stable des métadonnées.
- Modale de configuration (colonnes : 1–8, lignes : 1–6) ouverte via un bouton ⚙.
- `pageSize` = colonnes × lignes, passé à l'API.
- Nombre de colonnes CSS piloté par la config (CSS custom property).
- Configuration persistée dans `localStorage`, chargée au démarrage.
- Valeurs par défaut : 6 colonnes, 3 lignes (= 18 items, comportement inchangé).

**Non-Goals:**
- Synchronisation de la config entre onglets (pas d'événement `storage`).
- Configuration côté serveur ou par utilisateur authentifié.
- Choix de la taille de card individuelle (largeur min fixe à 200px).

## Decisions

### 1. Hauteur fixe des cards via flexbox
**Choix:** `.video-item` avec hauteur fixe (100px), `display: flex; flex-direction: column; justify-content: space-between`. Le nom est tronqué (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`).
**Pourquoi:** Solution CSS pure, pas de JS, compatible avec la grille existante.
**Alternative écartée:** `min-height` — ne garantit pas l'uniformité si certains titres sont très longs.

### 2. Colonnes CSS via `--grid-cols` custom property
**Choix:** `.video-list { grid-template-columns: repeat(var(--grid-cols, 6), minmax(200px, 1fr)); }`. La valeur est injectée via `document.documentElement.style.setProperty('--grid-cols', cols)`.
**Pourquoi:** Découple la logique JS de l'écriture CSS — un seul point de changement.
**Alternative écartée:** Modifier directement le `style.gridTemplateColumns` de l'élément — moins propre.

### 3. Modale de configuration réutilisant le pattern existant
**Choix:** Overlay plein écran + boîte centrée, même structure que `video-dialog`. Deux `<select>` (colonnes, lignes). Bouton "Appliquer" : sauvegarde + fermeture + rechargement page 1. Bouton "Annuler" : ferme sans sauvegarder.
**Pourquoi:** Cohérence visuelle avec l'UI existante, pas de dépendance externe.

### 4. Persistance localStorage
**Choix:** Clé `s3streamer_grid_config` → JSON `{ cols: number, rows: number }`.
**Pourquoi:** Simple, sans serveur, persiste entre rechargements.
**Fallback:** Si absent ou invalide, utiliser les valeurs par défaut (cols=6, rows=3).

### 5. Application immédiate au fetch
**Choix:** `pageSize` = cols × rows est calculé à chaque appel `fetchVideos`, en lisant l'état courant en mémoire (pas relire localStorage à chaque fois).
**Pourquoi:** État cohérent entre config et grille pendant toute la session.

## Risks / Trade-offs

- **Petits écrans** → Avec 8 colonnes, les cards font < 150px de large. Acceptable : l'utilisateur choisit lui-même la config.
- **Noms très longs** → L'ellipsis peut couper un nom utile. Mitigé : le titre complet reste accessible via la modale de lecture vidéo.

## Migration Plan

- Backward-compatible : les defaults (cols=6, rows=3) reproduisent exactement le comportement actuel (pageSize=18).
- Aucun changement d'API, pas de migration de données.
