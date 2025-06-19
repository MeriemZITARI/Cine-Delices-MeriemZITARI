import multer from 'multer';
import path from 'path';

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images-recettes')); // Dossier de stockage
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nom temporaire
  },
});

// Middleware Multer
const upload = multer({ storage });

export default upload;