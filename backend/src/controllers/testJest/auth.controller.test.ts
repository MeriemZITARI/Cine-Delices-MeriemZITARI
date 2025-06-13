import { handleRegister } from '../../controllers/auth.controller';
import { registerNewUser } from '../../services/auth.service';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services/auth.service'); // Mock du service registerNewUser

describe('handleRegister', () => {
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

  it('devrait enregistrer un utilisateur et définir un cookie', async () => {
    // Mock des données utilisateur et du token
    const mockUser = { id: 'user123', email: 'test@example.com', isAdmin: false };
    const mockToken = 'mocked_token';

    // Mock du service registerNewUser
    (registerNewUser as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });

    const req = mockRequest({ email: 'test@example.com', password: 'password123' }) as Request;
    const res = mockResponse() as Response;

    await handleRegister(req, res, mockNext);

    // Vérifications
    expect(registerNewUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(res.cookie).toHaveBeenCalledWith('access_token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Utilisateur enregistré et connecté avec succès',
      user: mockUser,
    });
  });

  it('devrait appeler next avec une erreur si le service registerNewUser échoue', async () => {
    // Mock d'une erreur dans le service registerNewUser
    const mockError = new Error('Erreur lors de l\'enregistrement.');
    (registerNewUser as jest.Mock).mockRejectedValue(mockError);

    const req = mockRequest({ email: 'test@example.com', password: 'password123' }) as Request;
    const res = mockResponse() as Response;

    await handleRegister(req, res, mockNext);

    // Vérifications
    expect(registerNewUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(res.cookie).not.toHaveBeenCalled(); // Aucun cookie ne doit être défini en cas d'erreur
    expect(res.status).not.toHaveBeenCalled(); // Aucun statut ne doit être défini en cas d'erreur
    expect(res.json).not.toHaveBeenCalled(); // Aucune réponse JSON ne doit être envoyée en cas d'erreur
  });
});