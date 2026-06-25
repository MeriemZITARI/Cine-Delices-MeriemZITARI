# 🎬 CinéDélices

CinéDélices est une application web full-stack permettant de découvrir, créer et partager des recettes inspirées de l'univers du cinéma.

Le projet a été initialement réalisé en équipe dans le cadre de ma formation de Concepteur Développeur d'Applications, en appliquant la méthodologie Agile Scrum (gestion du backlog, sprints, revues et travail collaboratif).

À l'issue du projet de groupe, j'ai poursuivi son développement individuellement afin d'enrichir l'application avec de nouvelles fonctionnalités et améliorations techniques, notamment la mise en place d'un tableau de bord administrateur, l'intégration de TanStack Query, le renforcement de la sécurité de l'authentification et l'optimisation de l'architecture frontend et backend.

---

## ✨ Fonctionnalités principales

### 👤 Espace utilisateur

* Création de compte et connexion
* Gestion du profil utilisateur
* Création de recettes personnalisées
* Modification et suppression de ses recettes
* Recherche de recettes
* Consultation du détail des recettes
* Association de recettes à des films

### 🎬 Univers cinéma

* Intégration d'API externes pour récupérer les informations de films
* Mise en relation des recettes avec des œuvres cinématographiques

### 🛠️ Dashboard administrateur

* Gestion des utilisateurs
* Gestion des ingrédients
* Gestion des recettes
* Validation des recettes soumises par les utilisateurs
* Modification et suppression des contenus

---

## 🔒 Sécurité

* Authentification basée sur des cookies HttpOnly
* Protection CSRF
* Hachage sécurisé des mots de passe avec Argon2
* Validation des données avec Zod
* Protection des routes administrateur
* Configuration CORS sécurisée

---

## ⚡ Optimisations techniques

### TanStack Query

Le projet utilise TanStack Query pour :

* la récupération des données serveur ;
* la mise en cache ;
* l'invalidation automatique du cache ;
* les mutations optimistes ;
* la réduction des appels réseau inutiles.

### Accessibilité

Des améliorations d'accessibilité ont été intégrées :

* navigation clavier ;
* association correcte des labels et champs de formulaire ;
* utilisation des attributs ARIA ;
* amélioration de l'expérience utilisateur sur les formulaires.

---

## 🏗️ Architecture technique

### Frontend

* React
* TypeScript
* React Router
* TanStack Query
* Axios
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* Zod
* JWT
* Argon2

### Base de données

* PostgreSQL

### Déploiement

* Docker
* Docker Compose

---

## 📸 Captures d'écran

### Page d'accueil

![Page d'accueil](docs/conception/images/localhost_3000_ajouter-recette%20(4).png)

### Formulaire de réation d'une recette

![Formulaire création](docs/conception/images/localhost_3000_ajouter-recette%20(3).png)

### Dashboard administrateur

![Dashboard administrateur](docs/conception/images/docs/conception/images/../../../localhost_3000_ajouter-recette%20(5).png)

---

## 🚀 Installation locale

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd front
cp .env.example .env
npm install
npm run dev
```

---

## 🐳 Exécution avec Docker

```bash
docker compose up --build
```

### Migrations Prisma

```bash
docker compose exec backend npx prisma migrate dev
```

### Déploiement des migrations

```bash
docker compose exec backend npx prisma migrate deploy
```

### Seed de la base de données

```bash
docker compose exec backend npx prisma db seed
```

---

## 🎯 Compétences mises en œuvre

* Développement Full-Stack
* Architecture REST
* Authentification sécurisée
* Gestion des rôles et permissions
* Administration d'application
* Gestion d'état serveur avec TanStack Query
* Dockerisation d'applications
* Modélisation de base de données avec Prisma
* Déploiement d'applications web

---

## 👩‍💻 Auteur

Meriem Zitari

Conceptrice Développeuse d'Applications
