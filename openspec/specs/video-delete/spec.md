# Spec: Video Delete

## Purpose

Defines the behaviour of the video deletion feature: a user can delete a video from remote S3 storage directly from the video dialog, after explicit confirmation. Covers the delete button, confirmation modal, backend API, post-deletion navigation, and cache invalidation.

## Requirements

### Requirement: Bouton de suppression dans le dialog
Le dialog vidéo SHALL afficher un bouton de suppression (icône 🗑) dans son header, à gauche du bouton fermer. Ce bouton SHALL être visible uniquement lorsque le dialog est ouvert.

#### Scenario: Bouton visible à l'ouverture du dialog
- **WHEN** l'utilisateur ouvre le dialog sur une vidéo
- **THEN** un bouton 🗑 est affiché dans le header, à gauche du bouton ×

---

### Requirement: Confirmation avant suppression
Avant toute suppression, le système SHALL afficher un dialogue de confirmation construit avec `Radix Dialog` et stylisé de manière distinctive avec Tailwind CSS (boutons larges, code couleur d'avertissement rouge pour l'action destructive). Le dialogue de confirmation SHALL afficher le nom exact du fichier vidéo. La suppression SHALL s'effectuer uniquement si l'utilisateur confirme explicitement. L'annulation SHALL fermer le dialogue de confirmation sans aucun effet.

#### Scenario: Clic sur le bouton supprimer
- **WHEN** l'utilisateur clique sur le bouton 🗑 dans le header du dialog
- **THEN** un dialogue de confirmation Radix s'affiche avec le message contenant le nom du fichier
- **THEN** le dialogue propose deux boutons clairs : "Confirmer" (rouge destructeur) et "Annuler"

#### Scenario: Annulation de la suppression
- **WHEN** l'utilisateur clique sur "Annuler" ou appuie sur Escape dans le dialogue de confirmation
- **THEN** le dialogue se ferme
- **THEN** le dialog vidéo principal reste ouvert, la vidéo continue de jouer

---

### Requirement: Suppression de l'objet S3
Lorsque l'utilisateur confirme la suppression, le système SHALL appeler `DELETE /api/videos/:key` pour supprimer l'objet du bucket S3. En cas d'échec de la requête, le système SHALL afficher un message d'erreur et conserver la vidéo dans le dialog.

#### Scenario: Suppression réussie
- **WHEN** l'utilisateur confirme la suppression d'une vidéo
- **THEN** le client envoie `DELETE /api/videos/:key` avec la clé encodée en URL
- **THEN** le backend supprime l'objet S3 correspondant
- **THEN** le backend retourne HTTP 200

#### Scenario: Échec de suppression (erreur serveur)
- **WHEN** la requête DELETE échoue (erreur réseau ou erreur S3)
- **THEN** le système affiche un message d'erreur à l'utilisateur
- **THEN** la vidéo reste affichée dans le dialog

---

### Requirement: Navigation post-suppression
Après une suppression réussie, le système SHALL naviguer automatiquement selon la priorité suivante : vidéo suivante dans le buffer si disponible, sinon vidéo précédente, sinon fermeture du dialog.

#### Scenario: Vidéo suivante disponible
- **WHEN** la suppression réussit et il existe une vidéo après celle supprimée dans le buffer
- **THEN** le dialog passe automatiquement à cette vidéo suivante

#### Scenario: Pas de vidéo suivante, précédente disponible
- **WHEN** la suppression réussit et la vidéo supprimée était la dernière du buffer
- **THEN** le dialog passe à la vidéo précédente

#### Scenario: Seule vidéo dans le buffer
- **WHEN** la suppression réussit et c'était la seule vidéo dans le buffer
- **THEN** le dialog se ferme automatiquement

---

### Requirement: Retrait immédiat de la card depuis la grille
Après suppression réussie, le système SHALL retirer immédiatement la card DOM correspondant à la vidéo supprimée de la grille visible en arrière-plan du dialog.

#### Scenario: Suppression d'une vidéo visible dans la grille
- **WHEN** la suppression réussit pour une vidéo dont la card est présente dans la grille
- **THEN** la card est retirée du DOM sans rechargement de la liste

---

### Requirement: Invalidation chirurgicale du cache backend
Après suppression réussie, le backend SHALL retirer l'entrée correspondante de `cachedContents` par comparaison de `Key`, sans invalider le reste du cache.

#### Scenario: Suppression d'un objet présent dans le cache
- **WHEN** un objet est supprimé de S3
- **THEN** le backend retire cet objet de `cachedContents`
- **THEN** les appels suivants à `/api/videos` ne retournent plus la vidéo supprimée
- **THEN** le reste du cache reste valide (pas de re-fetch S3)
