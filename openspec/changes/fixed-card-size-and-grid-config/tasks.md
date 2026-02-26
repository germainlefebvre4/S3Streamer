## 1. CSS — Cards à hauteur fixe

- [ ] 1.1 Donner une hauteur fixe à `.video-item` avec `display: flex; flex-direction: column; justify-content: space-between`
- [ ] 1.2 Appliquer `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` sur `.video-name`
- [ ] 1.3 Remplacer `repeat(auto-fill, minmax(300px, 1fr))` dans `.video-list` par `repeat(var(--grid-cols, 6), minmax(200px, 1fr))`

## 2. CSS — Modale de configuration

- [ ] 2.1 Ajouter les styles de la modale config (overlay semi-transparent, boîte centrée blanche, titre, sélecteurs, boutons)

## 3. HTML — Bouton config et modale

- [ ] 3.1 Ajouter le bouton ⚙ dans le header ou la zone de contrôles de la page
- [ ] 3.2 Ajouter la structure HTML de la modale config (overlay, titre, `<select>` colonnes 1–8, `<select>` lignes 1–6, bouton Appliquer, bouton Annuler)

## 4. JS — Lecture et application de la config

- [ ] 4.1 Définir les valeurs par défaut `{ cols: 6, rows: 3 }` et la clé localStorage `s3streamer_grid_config`
- [ ] 4.2 Charger la config au démarrage depuis `localStorage` (avec fallback sur les défauts si absente ou invalide)
- [ ] 4.3 Appliquer les colonnes CSS via `document.documentElement.style.setProperty('--grid-cols', cols)` au chargement

## 5. JS — Passage de `pageSize` à l'API

- [ ] 5.1 Calculer `pageSize = cols × rows` depuis la config courante
- [ ] 5.2 Inclure `pageSize` dans les paramètres de chaque appel `fetchVideos` (ajouter au `URLSearchParams`)

## 6. JS — Modale config : ouverture et fermeture

- [ ] 6.1 Ouvrir la modale au clic sur ⚙ et pré-sélectionner les valeurs courantes dans les sélecteurs
- [ ] 6.2 Fermer la modale sans changement au clic sur Annuler ou sur l'overlay
- [ ] 6.3 Fermer la modale et appliquer les changements au clic sur Appliquer

## 7. JS — Application de la config et persistance

- [ ] 7.1 Lire les valeurs des sélecteurs au clic sur Appliquer
- [ ] 7.2 Sauvegarder la config dans `localStorage`
- [ ] 7.3 Mettre à jour la CSS custom property `--grid-cols` avec la nouvelle valeur de colonnes
- [ ] 7.4 Appeler `fetchVideos(1)` pour recharger la grille avec le nouveau `pageSize`

## 8. Vérification

- [ ] 8.1 Vérifier que toutes les cards ont la même hauteur quel que soit le nom de fichier
- [ ] 8.2 Vérifier que le nom tronqué n'agrandit pas la card
- [ ] 8.3 Vérifier que la modale s'ouvre avec les valeurs pré-sélectionnées
- [ ] 8.4 Vérifier qu'Annuler ne déclenche pas de rechargement
- [ ] 8.5 Vérifier qu'Appliquer met à jour la grille et la pagination
- [ ] 8.6 Vérifier que la config est restaurée après rechargement de page
- [ ] 8.7 Vérifier le fallback sur les défauts si localStorage vide ou corrompu
