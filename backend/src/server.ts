// Fichier: src/server.ts
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import errorHandler from './middlewares/errorHandler';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
// import errorHandler from './middlewares/errorHandler';
import router from './routes';
// --- NOTRE SONDE DE DÉBOGAGE ---
console.log('--- Début du débogage ---');
console.log('Chemin de travail actuel:', process.cwd());
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('--- Fin du débogage ---');
// ---------------------------------

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Middlewares globaux
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes de l'API
app.use('/api', router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});