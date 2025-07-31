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
import { csrfProtection } from './middlewares/csrfProtection';
import { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// --- 1. MIDDLEWARES GLOBAUX ESSENTIELS (à déclarer en premier) ---
// Pour éviter les problèmes de sécurité, on utilise Helmet pour sécuriser les en-têtes HTTP



  


app.use(cors({ origin: ['http://localhost:3000', 'https://frontend-o5gt.onrender.com'], credentials: true }));

// Middleware pour servir les fichiers statiques (images, CSS, JS) depuis le dossier 'public'
app.use(express.static('public'));

app.use(helmet());
// Middleware pour parser les données JSON dans les requêtes
app.use(express.json());
// 
app.use(cookieParser());

const methodsToProtect = ['POST', 'PUT', 'PATCH', 'DELETE'];
// Middleware CSRF pour protéger les routes sensibles
app.use((req, res, next) => {
  if (methodsToProtect.includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});

// Limiter le nombre de requêtes pour éviter les abus
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000 }));



// Routes pour les fichiers statiques (ex: images) et la documentation
setupSwagger(app);
// Exposer le CSRF token au frontend
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  const token = req.csrfToken(); // maintenant cette méthode existe bien
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // pour que le frontend puisse le lire
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.status(200).json({ csrfToken: token });
});

// Routes principales de l'API
app.use((req, res, next) => {
  console.log('🧭 Requête reçue :', req.method, req.originalUrl);
  next();
});

// --- 2. ROUTES DE L'APPLICATION ---

app.use('/api', router);


// --- 3. MIDDLEWARE 404 : route non trouvée ---
app.use(notFoundHandler());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      message: 'Échec de vérification CSRF. Veuillez recharger la page ou vous reconnecter.',
    });
  }
  next(err);
});


// --- 3. GESTIONNAIRE D'ERREURS (doit toujours être en dernier) ---
app.use(errorHandler);


// --- 4. LANCEMENT DU SERVEUR ---
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});