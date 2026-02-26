## ADDED Requirements

### Requirement: Cache en mémoire de la liste S3
Le système SHALL maintenir un cache en mémoire de la liste complète des objets S3, invalidé automatiquement après un TTL configurable via `CACHE_TTL_SECONDS` (défaut : 300 secondes).

#### Scenario: Premier chargement (cache froid)
- **WHEN** le cache est vide ou expiré
- **THEN** le système exécute la boucle de récupération S3 complète (continuation tokens)
- **THEN** le résultat est stocké en cache avec un timestamp d'expiration

#### Scenario: Chargements suivants (cache chaud)
- **WHEN** le cache est valide (non expiré)
- **THEN** le système retourne la liste depuis le cache sans appeler S3
- **THEN** le temps de réponse est inférieur à 50 ms

#### Scenario: Expiration du TTL
- **WHEN** le TTL est écoulé depuis le dernier remplissage du cache
- **THEN** la prochaine requête déclenche un nouveau chargement S3 complet
- **THEN** le cache est mis à jour avec la liste fraîche

#### Scenario: TTL configurable
- **WHEN** la variable d'environnement `CACHE_TTL_SECONDS` est définie
- **THEN** le cache expire après ce nombre de secondes
- **WHEN** `CACHE_TTL_SECONDS` n'est pas définie
- **THEN** le cache expire après 300 secondes (5 minutes)
