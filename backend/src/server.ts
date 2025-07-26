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
import notFoundHandler from './middlewares/404NotFound';

const app = express();
const PORT = process.env.PORT || 3001;

// --- 1. MIDDLEWARES GLOBAUX ESSENTIELS (à déclarer en premier) ---
// Pour éviter les problèmes de sécurité, on utilise Helmet pour sécuriser les en-têtes HTTP



  


app.use(cors({ origin: ['http://localhost:3000', 'https://frontend-o5gt.onrender.com'], credentials: true }));

// Middleware pour servir les fichiers statiques (images, CSS, JS) depuis le dossier 'public'
app.use(express.static('public'));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// Limiter le nombre de requêtes pour éviter les abus
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000 }));

// --- 2. ROUTES DE L'APPLICATION ---

// Routes pour les fichiers statiques (ex: images) et la documentation
setupSwagger(app);

// Routes principales de l'API
app.use('/api', router);

// --- 3. MIDDLEWARE 404 : route non trouvée ---
app.use(notFoundHandler());
// --- 3. GESTIONNAIRE D'ERREURS (doit toujours être en dernier) ---
app.use(errorHandler);


// --- 4. LANCEMENT DU SERVEUR ---
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});