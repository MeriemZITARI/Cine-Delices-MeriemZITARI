# Étape 1 : Utiliser une image Node.js officielle comme base
FROM node:22-alpine 


# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install
RUN apk add --no-cache openssl libressl-dev

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]