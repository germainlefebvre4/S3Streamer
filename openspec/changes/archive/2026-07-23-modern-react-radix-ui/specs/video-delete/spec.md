## MODIFIED Requirements

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
