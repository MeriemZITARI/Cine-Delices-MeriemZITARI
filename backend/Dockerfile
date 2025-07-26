# Étape 1 : Utiliser une image Node.js officielle comme base
FROM node:22-alpine 

# Installer OpenSSL (si nécessaire)
RUN apk add --no-cache openssl openssl-dev

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le dossier prisma (contenant schema.prisma)
COPY prisma ./prisma

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Copier le dossier generated dans dist/generated pour que Prisma client soit accessible en prod
RUN cp -r ../generated ./dist/generated

# Exposer le port sur lequel l'application écoute
EXPOSE 3001

# Définir la commande pour démarrer l'application
CMD ["npm","run", "start"]