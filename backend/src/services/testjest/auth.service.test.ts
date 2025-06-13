// Fichier: src/services/auth.service.test.ts

import { registerNewUser } from '../auth.service';
import { prisma }from '../../client/prismaClient'; // Le chemin que ton service utilise
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// --- Le Mock Robuste et Simple ---
// On dit à Jest: "Quand un fichier importe '../client/prismaClient', ne lui donne
// pas le vrai fichier. Donne-lui cette fausse version à la place."
jest.mock('../../client/prismaClient', () => ({
  // On simule l'export nommé `prisma`
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// On simule les autres dépendances externes
jest.mock('argon2');
jest.mock('jsonwebtoken');

// --- LE TEST ---
describe("Service d'Inscription (registerNewUser)", () => {
  // On nettoie les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("doit créer un utilisateur et un token si l'email est nouveau", async () => {
    // 1. Préparation (Arrange)
    const inputData = { email: 'test@example.com', password: 'Password123!', firstName: 'Test', lastName: 'User' };

    // On prépare les réponses de nos fonctions simulées
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: '123', ...inputData });
    (argon2.hash as jest.Mock).mockResolvedValue('un_mot_de_passe_hache');
    (jwt.sign as jest.Mock).mockReturnValue('un_faux_token_jwt');

    // 2. Action ici 
    const result = await registerNewUser(inputData);

    // 3. Assertion (Assert)
    // On vérifie que la fonction a retourné la bonne structure
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    // On vérifie les valeurs
    expect(result.user.email).toBe(inputData.email);
    expect(result.token).toBe('un_faux_token_jwt');
    // On vérifie que le mot de passe n'est pas renvoyé
    expect(result.user).not.toHaveProperty('password');
  });

  it("doit lancer une erreur si l'email existe déjà", async () => {
    // 1. Préparation
    const inputData = { email: 'existing@example.com', password: 'Password123!', firstName: 'Test', lastName: 'User' };
    
    // On dit à notre faux Prisma de TROUVER un utilisateur
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '456', email: 'existing@example.com' });

    // 2. Action & Assertion
    // On vérifie que l'appel de la fonction va bien lancer une erreur
    await expect(registerNewUser(inputData)).rejects.toThrow('Un utilisateur avec cet email existe déjà.');

    // On vérifie que la création d'utilisateur n'a jamais été tentée
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});


