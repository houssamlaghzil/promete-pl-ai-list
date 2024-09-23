# Utilise l'image officielle de Node.js comme image de base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tout le code source dans le répertoire de travail du conteneur
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
