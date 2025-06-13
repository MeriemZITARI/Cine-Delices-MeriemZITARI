# 🎬 Projet Cine-Délices

---

## ⚙️ Dépendances installées

### 🔧 Backend (Express + Prisma)

- `express`  
- `typescript`  
- `dotenv`  
- `prisma`  
- `@prisma/client`  
- `cookie-parser`  
- `express-rate-limit`  
- `express-session`  
- `helmet`  
- `pg`  
- `zod`  
- `cors`  
- `argon2`  
- `jsonwebtoken`  
- `swagger-jsdoc`  
- `swagger-ui-express`  

---

### 🖥️ Frontend (React + Vite)

- `react`  
- `react-dom`  
- `typescript`  
- `axios`  
- `tailwindcss`  
- `shadcn-ui`  
- `vite`  
- `lucide-react`  
- `react-icons`  
- `react-router-dom`  
- `react-slick`  
- `slick-carousel`  
- `clsx`  
- `class-variance-authority`  
- `@radix-ui/react-icons`  
- `tailwindcss-animate`  
- `@biomejs/biome`  

---

## 🚀 Démarrage du projet

### 🔧 Backend

```bash

cd backend
cp .env.example .env
npm install
npm run dev```

➡️ npm run dev lance le serveur backend avec ts-node-dev

---

### 🖥️ Frontend 

```bash
cd front
cp .env.example .env
npm install
npm run dev```

➡️ npm run dev démarre le serveur Vite pour le frontend React

---

## Les commandes docker 

```bash

docker compose down -V # pour stopper les conteneurs et supprimer les volumes
docker compose build --no-cache # pour reconstruire les images sans utiliser les images précédentes
docker compose up -d # pour lancer les conteneurs en arrière plan 
