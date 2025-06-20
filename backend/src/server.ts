// Fichier: src/server.ts (Version Corrigée et Réorganisée)
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import errorHandler from './middlewares/errorHandler';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// --- 1. MIDDLEWARES GLOBAUX ESSENTIELS (à déclarer en premier) ---
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000 }));

// --- 2. ROUTES DE L'APPLICATION ---

// Routes pour les fichiers statiques (ex: images) et la documentation
setupSwagger(app);

// Routes principales de l'API
app.use('/api', router);


// --- 3. GESTIONNAIRE D'ERREURS (doit toujours être en dernier) ---
app.use(errorHandler);


// --- 4. LANCEMENT DU SERVEUR ---
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});