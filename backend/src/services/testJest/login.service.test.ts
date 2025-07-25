import { loginUser } from '../login.service';
import { prisma } from '../../client/prismaClient';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
// Importer les modules nécessaires pour les tests
jest.mock('../../client/prismaClient', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('loginUser', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    password: 'hashed_password',
    isAdmin: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret'; // Définir une clé JWT pour les tests
  });

  it('devrait authentifier un utilisateur valide et retourner un token', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked_token');

    const result = await loginUser({ email: 'test@example.com', password: 'password123' });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(argon2.verify).toHaveBeenCalledWith('hashed_password', 'password123');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 'user123', isAdmin: false },
      'test_secret',
      { expiresIn: '1h' }
    );
    expect(result).toEqual({
      user: {
        id: 'user123',
        email: 'test@example.com',
        isAdmin: false,
      },
      token: 'mocked_token',
    });
  });

  it('devrait lever une erreur si l\'utilisateur n\'existe pas', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(loginUser({ email: 'unknown@example.com', password: 'password123' }))
      .rejects
      .toThrow('Email ou mot de passe incorrect.');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'unknown@example.com' } });
  });

  it('devrait lever une erreur si le mot de passe est incorrect', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(loginUser({ email: 'test@example.com', password: 'wrongpassword' }))
      .rejects
      .toThrow('Email ou mot de passe incorrect.');

    expect(argon2.verify).toHaveBeenCalledWith('hashed_password', 'wrongpassword');
  });

  it('devrait lever une erreur si JWT_SECRET n\'est pas défini', async () => {
    delete process.env.JWT_SECRET;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(true);

    await expect(loginUser({ email: 'test@example.com', password: 'password123' }))
      .rejects
      .toThrow('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
  });
});