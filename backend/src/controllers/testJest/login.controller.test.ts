import { handleLogin } from '../../controllers/login.controller';
import { loginUser } from '../../services/login.service';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services/login.service'); // Mock du service loginUser

describe('handleLogin', () => {
  const mockRequest = (body: any): Partial<Request> => ({ body });
  const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.cookie = jest.fn();
    return res;
  };
  const mockNext: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait connecter un utilisateur valide et définir un cookie', async () => {
    // Mock des données utilisateur et du token
    const mockUser = { id: 'user123', email: 'test@example.com', isAdmin: false };
    const mockToken = 'mocked_token';

    // Mock du service loginUser
    (loginUser as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });

    const req = mockRequest({ email: 'test@example.com', password: 'password123' }) as Request;
    const res = mockResponse() as Response;

    await handleLogin(req, res, mockNext);

    // Vérifications
    expect(loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(res.cookie).toHaveBeenCalledWith('access_token', mockToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SAMESITE === 'none',
      sameSite: process.env.COOKIE_SAMESITE  as 'none' | 'lax' | 'strict',
      maxAge: 3600000,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Connexion réussie',
      user: mockUser,
    });
  });

  it('devrait appeler next avec une erreur si le service loginUser échoue', async () => {
    // Mock d'une erreur dans le service loginUser
    const mockError = new Error('Email ou mot de passe incorrect.');
    (loginUser as jest.Mock).mockRejectedValue(mockError);

    const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' }) as Request;
    const res = mockResponse() as Response;

    await handleLogin(req, res, mockNext);

    // Vérifications
    expect(loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'wrongpassword' });
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(res.cookie).not.toHaveBeenCalled(); // Aucun cookie ne doit être défini en cas d'erreur
    expect(res.status).not.toHaveBeenCalled(); // Aucun statut ne doit être défini en cas d'erreur
    expect(res.json).not.toHaveBeenCalled(); // Aucune réponse JSON ne doit être envoyée en cas d'erreur
  });
});