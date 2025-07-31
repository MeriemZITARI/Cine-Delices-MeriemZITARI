
import csrf from 'csurf';
// Middleware CSRF avec stockage du token dans un cookie
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,     // empêche l'accès via JavaScript côté client
    secure: true,        // uniquement via HTTPS (OK pour production avec SameSite: 'None')
    sameSite: 'none',    // autorise le cookie en cross-origin
    path: '/',           // disponible pour toutes les routes
  }
});
