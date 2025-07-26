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

# Corriger automatiquement les vulnérabilités (facultatif mais utile)
RUN npm audit fix

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Générer le client Prisma
RUN npx prisma generate



# Compiler le code TypeScript
RUN npm run build

# Copier les fichiers générés Prisma vers le dossier dist (nécessaire si output = ../generated/prisma)
RUN mkdir -p dist/generated && cp -r generated/prisma dist/generated/prisma

# Exposer le port sur lequel l'application écoute
EXPOSE 3001

# Définir la commande pour démarrer l'application
CMD ["npm","run", "start"]