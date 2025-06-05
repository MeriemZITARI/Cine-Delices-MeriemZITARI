# Ciné Délices

Cahier des charges

## Présentation du produit

Ciné Délices est un projet de site web original mêlant cinéma et gastronomie, conçu dans le cadre d’un projet pédagogique de développement web. Ce site proposera un catalogue de recettes de cuisine inspirées de films et de séries, créant ainsi une expérience immersive et ludique pour les amateurs de pop culture et de cuisine.

Le site s’adresse à un public curieux, passionné par la cuisine et la culture cinématographique, en lui offrant des recettes thématiques accompagnées de références à leurs œuvres d’origine, d’anecdotes, et d’un contenu interactif.

Objectif principal : créer une plateforme intuitive, responsive et sécurisée permettant aux utilisateurs de :

- Découvrir des recettes associées à des films ou séries,
- Rechercher et filtrer facilement selon leurs goûts ou envies,
- Contribuer en postant leurs propres créations,
- Gérer un profil personnel,
- Et pour les administrateurs, modérer et gérer les contenus via un espace dédié.

Développé en plusieurs étapes (méthode agile), le projet évoluera progressivement avec un MVP (Minimum Viable Product) fonctionnel dès les premiers sprints. Les fonctionnalités additionnelles (sociales, recommandation, favoris, etc.) viendront enrichir l’expérience dans les phases suivantes.

Le projet est aussi l’occasion de mettre en œuvre des compétences techniques variées : développement web fullstack, sécurité, accessibilité, responsive design, versionning Git, API, conteneurisation, tests, et éco-conception.

## Définition des besoins et des objectifs

### Besoins – Problèmes identifiés

1. **Absence de direct entre cuisine et culture cinématographique :** Il existe peu (voire pas) de plateformes qui exploitent le croisement entre cuisine et culture cinématographique pourtant très populaires.
2. **Manque d’un côté immersif et original dans les sites de recettes :** Les sites culinaires sont souvent conçus de manière classique, sans axe créatif ou narratif fort. Les utilisateurs recherchent de plus en plus des contenus interactifs, engageants et sur mesure.
3. **Absence d’un espace communautaire autour de la cuisine inspirée du cinéma :** Pas de plateforme dédiée où les passionnés peuvent échanger, commenter ou proposer leurs propres recettes inspirées de films/séries.

### Objectifs – Solutions apportées

1. **Créer une passerelle originale entre culture et gastronomie :** Associer chaque recette à un film ou une série pour rendre l’expérience culinaire plus ludique et narrative.

2. **Proposer un site web moderne, responsive et accessible :** Développé en mobile-first, optimisé pour tous les écrans, conforme aux normes d’accessibilité (WCAG) et permettant aux utilisateurs de trouver des recettes selon différents critères (titre, œuvre, type de plat…).
3. **Poser les bases d’un projet évolutif basé sur la contribution et l’interactivité :** Rendre la publication de recettes accessible aux utilisateurs connectés tout en prévoyant des évolutions comme des fonctionnalités sociales, des recommandations, ou une liste de courses à générer automatiquement.

## Public cible

Le projet Ciné Délices s’adresse à une audience plutôt adulte, à la croisée des chemins entre les passionnés de cinéma et les amateurs de cuisine maison, avec une appétence particulière pour les expériences culturelles originales et immersives.

## Besoins Fonctionnels (Minimum Viable Product - MVP)

- **Catalogue de recettes :** affichage d’une liste de recettes inspirées du cinéma et des séries.
- **Moteur de recherche :** recherche par titre de recette, nom de film/série, catégorie (entrée, plat, dessert…).
- **Page recette :** affichage des ingrédients, des instructions, du film/série associé, et informations complémentaires (anecdote, citation, …).
- **Système d'authentification :** inscription, connexion, déconnexion.
- **Gestion du profil :** affichage et modification des informations du profil (nom, e-mail, mot de passe, …), réservé aux utilisateurs connectés.
- **Page ajout d’une recette :** formulaire d’ajout d’une nouvelle recette, réservé aux utilisateurs connectés.
- **Back-office (administration) :** gestion des recettes, catégories et utilisateurs (création, modification, suppression, modération), réservé aux utilisateurs connectés avec droits d’administration.

## Évolutions potentielles en v2 : fonctionnalités sociales

- **Commentaires sur les recettes :** commentaires sur les recettes (avec modération dans le back-office). Fonctionnalité réservée aux utilisateurs connectés.
- **Likes sur les recettes :** likes sur les recettes. Fonctionnalité réservée aux utilisateurs connectés.
- **Notation des recettes :** système de notation sur les recettes. Fonctionnalité réservée aux utilisateurs connectés.
- **Système de favoris :** possibilité de sauvegarder des recettes dans une liste de favoris et de retrouver cette liste sur la page profil. Fonctionnalité réservée aux utilisateurs connectés.
- **Dashboard utilisateur :** statistiques perso sur les recettes des films/séries favoris, les recettes réalisées, les recettes commentées, etc. Fonctionnalité réservée aux utilisateurs connectés.
- **Classement des recettes :** par popularité, par note, par date de publication, etc.

## Évolutions potentielles en v3 : fonctionnalités avancées

- **Gestion des ingrédients** (rappel : en MVP on gère les ingrédients sous forme de texte). Fonctionnalité réservée aux utilisateurs connectés avec droits d’administration.
- **Liste de courses :** possibilité de générer une liste de courses à partir d'une ou plusieurs recettes sélectionnées par l'utilisateur. Fonctionnalité réservée aux utilisateurs connectés.
- **Catalogue de recettes :** ajouter un filtre supplémentaire (par ingrédient).
- **Recommandations personnalisées :** système de recommandation de recettes en fonction des recettes, des films/séries, des favoris, des commentaires, etc.
- **Système de notifications :** pour les commentaires, les likes, les recettes similaires, etc.
- **Moteur de recherche dynamique :** affichage des résultats pertinents au fur et à mesure de la saisie, classé par pertinence ou popularité.
- **Support multilingue :** au moins anglais et français.

## Architecture du projet

Le projet Cine Délices repose sur une architecture web moderne en trois couches :

**Frontend :** application web réactive (SPA) permettant l’interaction avec les utilisateurs finaux (recherche, affichage, ajout de recettes, gestion du profil, etc.).

**Backend (API REST) :** serveur Node.js/Express qui traite les requêtes du frontend, applique la logique métier, gère la sécurité et fournit les données via une API structurée.

**Base de données (BDD) :** système relationnel PostgreSQL, stockant les utilisateurs, les recettes, les catégories, etc.

Ce découpage garantit :

- Une séparation claire des responsabilités (interface/logique métier/persistance),
- Une scalabilité (chaque couche peut évoluer indépendamment),
- Une maintenabilité et une sécurité accrues.

## Technologies utilisées pour le projet

| Catégorie | Technologie / Outil | Usage | Justification technique |
| --------- | ------------------- | ----- | -------------------- |
| Sécurité | Argon2 | Hashage des mots de passe | Algorithme sécurisé, recommandé par l’OWASP |
| | Helmet | Ajout automatique de headers HTTP sécurisés | Protection contre les attaques courantes (XSS, clickjacking, etc.) |
| | CORS | Vérification de l’origine des requêtes | Empêche les requêtes non autorisées entre domaines |
| | Express Rate Limit | Limitation du nombre de requêtes | Protection contre les attaques par force brute |
| | Dompurify | Nettoyage des contenus HTML utilisateurs | Protection contre les injections XSS |
| | JWT | Authentification stateless | Standard moderne, scalable, pratique pour la gestion des sessions côté client |
| Validation & Typage | Zod | Validation des schémas côté backend | Intégration facile avec TypeScript, validation robuste |
| | TypeScript | Typage statique | Meilleure maintenabilité, réduction des bugs |
| Routage & API | Express | Framework backend pour gérer les routes | Léger, flexible, adapté à un projet fullstack |
| | Swagger | Documentation interactive de l’API | Améliore la collaboration, permet de tester et lire l’API facilement |
| | Insomnia | Test manuel des routes | Facilite les vérifications et débogage côté backend |
| Backend / Environnement | Node.js | Environnement serveur (exécution JS côté backend) | Performant, asynchrone, riche écosystème |
| | Dotenv | Gestion des variables d’environnement | Sécurise les clés sensibles, permet de séparer code et config |
| | Prisma | ORM pour accéder à la base de données | Génère automatiquement les types TypeScript, requêtes intuitives, migrations faciles |
| Frontend | React | Interface utilisateur (SPA) | Expérience fluide, composantielle, mobile first |
| | TypeScript | Typage statique | Meilleure maintenabilité, réduction des bugs |
| Conteneurisation / Déploiement | Docker | Conteneurisation de l’environnement | Facilite le déploiement, isole les environnements, reproductibilité assurée |
| Collaboration / Versionnage | Git & GitHub | Versionnage et travail collaboratif | Suivi des modifications, gestion des branches, pull requests, etc. |

### Ergonomie pensée pour la diversité des utilisateurs

La cible inclut des profils variés, du cuisinier novice au fan aguerri, avec des niveaux techniques divers. L’interface doit donc être simple, intuitive et accessible, avec une navigation fluide permettant de trouver rapidement une recette, un film, ou un thème.

Les fonctionnalités comme la recherche par titre, les filtres, et la catégorisation doivent être visibles et faciles à utiliser.

### Responsive design pour un accès multi-supports

Les amateurs de cinéma consultent souvent des contenus sur mobile, tablette ou ordinateur selon leur contexte (ex : tablette en cuisine, smartphone en déplacement). Le site doit donc être entièrement responsive, garantissant une expérience optimale, que ce soit sur grand écran ou petit écran. Un bon équilibre entre esthétique et ergonomie est essentiel pour retenir l’attention de la cible, notamment lors de la consultation des recettes en pleine cuisine.

## Navigateurs compatibles

Afin d’assurer une accessibilité optimale et une expérience utilisateur fluide sur la majorité des plateformes, l’application Ciné Délices sera compatible avec les principaux navigateurs modernes, à jour, sur desktop comme sur mobile.

### Navigateurs ciblés (compatibilité garantie)

| Navigateur | Version | Plateforme |
| ---------- | ------- | ---------- |
| Google Chrome | 137.0 | Windows, macOS, Android |
| Mozilla Firefox | 139.0 | Windows, macOS, Linux |
| Microsoft Edge | 134.0 | Windows |
| Safari | 18.4 | macOS, iOS |
| Opera | 119.0 | Windows, macOS |

### Détails techniques

Flexbox / Grid CSS utilisés pour le responsive design.

Tests de compatibilité effectués principalement sur les versions les plus récentes des navigateurs.

L’application ne sera pas testée sur Internet Explorer, considéré comme obsolète.

### Spécificités mobiles

L’interface étant développée en mobile first, une attention particulière sera portée à la compatibilité avec les navigateurs mobiles tels que :

- Chrome (Android)
- Safari (iOS)
- Firefox Mobile

## Arborescence de l'application v1 (front)

| URL | Rôle | Accessible à |
| --- | ---- | ------------ |
| / | Page d’accueil avec catalogue des recettes | Visiteur |
| /recettes | Liste des recettes (+ recherche/filtre) | Visiteur |
| /recettes/:id | Page de détail d’une recette | Visiteur |
| /recettes/ajouter | Ajouter une recette (auth requis) | Utilisateur |
| /connexion | Page de connexion | Visiteur |
| /inscription | Page d’inscription | Visiteur |
| /profil | Gestion du profil utilisateur (auth requis) | Utilisateur |
| /admin | Accès au back-office (admin seulement) | Administrateur |
| /admin/recettes | Gestion des recettes (admin) | Administrateur |
| /admin/categories | Gestion des catégories (admin) | Administrateur |
| /admin/utilisateurs | Gestion des utilisateurs (admin) | Administrateur |

## Liste des routes prévues en v1 (API)

| Endpoint | Méthode | Accès | Rôle |
| -------- | ------- | ----- | ---- |
| /api/recipes | GET | Public | Lister/rechercher/filtrer recettes |
| /api/recipes/:id | GET | Public | Détail d’une recette |
| /api/recipes | POST | Connecté | Ajouter une recette |
| /api/recipes/:id | PUT | Admin | Modifier une recette (back-office) |
| /api/recipes/:id | DELETE | Admin | Supprimer une recette (back-office) |
| /api/categories | GET | Public | Lister les catégories pour filtrage |
| /api/categories | POST | Admin | Ajouter une catégorie |
| /api/categories/:id | PUT | Admin | Modifier une catégorie |
| /api/categories/:id | DELETE | Admin | Supprimer une catégorie |
| /api/auth/register | POST | Public | Inscription utilisateur |
| /api/auth/login | POST | Public | Connexion utilisateur |
| /api/users | GET | Admin | Lister tous les utilisateurs (back-office) |
| /api/users/:id | PUT | Admin | Modifier un utilisateur (rôle, etc.) |
| /api/users/:id | DELETE | Admin | Supprimer un utilisateur |

## User Stories – MVP CineDélices

### Catalogue de recettes

En tant que visiteur, je peux parcourir le catalogue de recettes afin de découvrir des plats inspirés de films ou de séries.

En tant que visiteur, je peux rechercher une recette par son titre afin de trouver rapidement ce que je veux cuisiner.

En tant que visiteur, je peux rechercher une recette par le titre d'un film/série afin de trouver des plats en rapport avec un film/série spécifique.

En tant que visiteur, je peux filtrer les recettes par catégorie (entrée, plat, dessert…) afin de n’afficher que ce qui m’intéresse.

En tant qu’utilisateur connecté, je peux parcourir le catalogue de recettes afin de découvrir des plats inspirés de films ou de séries.

En tant qu’utilisateur connecté, je peux rechercher une recette par son titre afin de trouver rapidement ce que je veux cuisiner.

En tant qu’utilisateur connecté, je peux rechercher une recette par le titre d'un film/série afin de trouver des plats en rapport avec un film/série spécifique.

En tant qu’utilisateur connecté, je peux filtrer les recettes par catégorie (entrée, plat, dessert…) afin de n’afficher que ce qui m’intéresse.

### Page recette

En tant qu’utilisateur, je peux consulter le détail d’une recette afin de voir la liste des ingrédients, les instructions et l’œuvre associée.

En tant qu’utilisateur, je peux lire des anecdotes ou informations complémentaires liées à la recette afin d’enrichir ma culture ciné-gastronomique.

### Authentification & gestion de profil

En tant que visiteur, je peux créer un compte afin d’accéder à des fonctionnalités réservées aux membres.

En tant qu’utilisateur, je peux me connecter à mon compte afin de personnaliser mon expérience et d'accéder à mes informations.

En tant qu'utilisateur ayant oublié son mot de passe, je peux demander à le réinitialiser afin de récupérer l'accès à mon compte.

En tant qu’utilisateur connecté, je peux modifier les informations de mon compte (ex: email, mot de passe, nom d'utilisateur) afin de les mettre à jour.

En tant qu’utilisateur connecté, je peux supprimer mon compte afin de retirer définitivement mes informations personnelles et mes contributions du site (selon les politiques de conservation).

### Gestion de recettes (par l'utilisateur)

En tant qu’utilisateur connecté, je peux proposer une nouvelle recette (titre, description, ingrédients, étapes, photo, film/série associé(e)) afin de la partager avec la communauté.

En tant qu’utilisateur connecté, je peux modifier les recettes que j'ai proposées (tant qu'elles ne sont pas encore validées par un administrateur, ou selon conditions) afin de les corriger ou de les améliorer.

En tant qu’utilisateur connecté, je peux supprimer une de mes recettes proposées (si elle n'est pas encore validée ou selon conditions) afin de gérer mes contributions.

### Back-office (Administration)

#### Gestion des catégories

En tant qu’administrateur, je peux ajouter de nouvelles catégories afin d'enrichir et d'organiser le contenu pour les utilisateurs.

En tant qu’administrateur, je peux modifier les catégories existantes (ex: changer leur nom, leur description) afin d’optimiser l'organisation du contenu.

En tant qu’administrateur, je peux supprimer des catégories afin de retirer celles qui sont obsolètes ou non pertinentes.

#### Gestion des recettes

En tant qu'administrateur, je peux valider les recettes proposées par les utilisateurs afin de les rendre visibles à tous.

En tant qu'administrateur, je peux modifier n'importe quelle recette (y compris celles des utilisateurs) afin de garantir la qualité, la cohérence ou corriger des erreurs.

En tant qu'administrateur, je peux supprimer n'importe quelle recette (même celles déjà publiées) afin de maintenir un catalogue pertinent et de qualité.

#### Gestion des utilisateurs

En tant qu’administrateur, je peux consulter la liste de tous les utilisateurs et leurs informations de profil.

En tant qu’administrateur, je peux modifier les informations ou les rôles des utilisateurs (ex: passer un utilisateur en modérateur, corriger une adresse email erronée).

En tant qu’administrateur, je peux suspendre temporairement un compte utilisateur en cas de non-respect des règles.

En tant qu’administrateur, je peux supprimer (bannir) définitivement un compte utilisateur en cas de violations graves ou répétées.

## Analyse des risques

### Risques liés à l’utilisation

| Risque | Description | Mesures préventives |
| ------ | ----------- | ------------------- |
| Fonctionnalité inutile ou mal conçue | Fonction qui ne répond pas aux besoins des utilisateurs. | Recueillir des retours utilisateurs dès le début (prototype, testeurs). |
| Surcharge serveur (DDoS ou pic de trafic) | API indisponible ou lente. | Mise en cache, protection DDoS, scalabilité horizontale, surveillance active (logs, alertes). |

### Risques techniques

| Risque | Description | Mesures préventives |
| ------ | ----------- | ------------------- |
| Bugs ou régressions | Une nouvelle fonctionnalité casse une existante. | Tests automatisés (unitaires + d’intégration), CI/CD, relecture de code. |
| Erreurs de sécurité | Faille d'authentification, injection SQL ou XSS, notamment au niveau des zones de saisie de texte | Validation des données, chiffrement, tests de sécurité, usage de frameworks éprouvés. |
| API non scalable | Mauvaise gestion de la charge (ex. nombreux appels GET). | Optimisation des requêtes, pagination, mise en cache, stress tests. |
| Perte de données | Mauvaise manipulation des bases de données. | Sauvegardes régulières, environnement de test séparé de la prod. |
| Non-conformité aux normes REST | Incohérences dans les routes ou les statuts HTTP. | Mise en place de conventions API dès le départ, documentation claire (ex : Swagger/OpenAPI). |

### Risques de gestion de projet

| Risque | Description | Mesures préventives |
| ------ | ----------- | ------------------- |
| Dérive du périmètre (scope creep) | Ajout de fonctionnalités non prévues. | Définir un MVP clair, suivre une roadmap stricte, valider chaque ajout avec les parties prenantes. |
| Retards de développement | Difficultés techniques ou mauvaise estimation du temps. | Méthodologie agile, sprints courts, marges dans le planning. |
| Manque de communication | Problèmes de coordination entre développeurs ou avec le client. | Réunions régulières, outils collaboratifs (Slack, Notion, Trello…). |
| Documentation absente ou incomplète | API difficile à utiliser ou à maintenir. | Intégrer la documentation dans le workflow (Swagger, Postman…), revues régulières. |

### Risques humains

| Risque | Description | Mesures préventives |
| ------ | ----------- | ------------------- |
| Turnover dans l’équipe | Départ d’un développeur clé. | Code clair, documentation, pair programming, onboarding solide. |
| Manque de compétences | L’équipe ne maîtrise pas certaines technologies. | Formations, accompagnement, choix technologiques adaptés au niveau de l’équipe. |

## Liste des rôles de chacun

- **Dimitri :** Lead dev back
- **Eric :** Lead dev front
- **Kader :** Git-Master
- **Meriem :** Product owner
- **Thuy-Trang :** Product owner
