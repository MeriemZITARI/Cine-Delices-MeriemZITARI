# Diagramme de séquence

## Le controller (contrôleur)

Rôle :

- Point d’entrée d’une route HTTP (POST, GET, etc.)
- Reçoit la requête du client (via l’API)
- Vérifie, parse, transmet la demande au service
- Retourne la réponse HTTP

Ce qu’il fait (exemple Recette) :

- Récupère les données du body/query/params
- (Option) Valide le schéma avec Zod
- Appelle la fonction du service métier
- Gère les codes HTTP et messages de retour

Il NE fait PAS :

- Pas de logique métier complexe (pas de calcul, pas d’accès DB direct)
- Pas de gestion profonde de données

## Le service (service métier)

Rôle :

- Gère la logique métier (tout ce qui concerne la Recette)
- Manipule les données, appelle la base de données
- Contient toute l’intelligence “métier” (règles, calculs, associations…)

Ce qu’il fait (exemple Recette) :

- Crée, modifie, supprime des recettes
- Gère l’association recette/film/ingrédients
- Fait les requêtes à la base (via ORM ou SQL)
- Valide la cohérence métier
- (Option) Appelle d’autres services

Il NE fait PAS :

- Ne gère pas les requêtes HTTP directement
- Ne s’occupe pas des statuts de réponse
