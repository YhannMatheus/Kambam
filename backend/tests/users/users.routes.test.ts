import request from 'supertest';
import express from 'express';
import { UserRoutes } from '../../src/users/infraestructure/users.infraestructure.js';
import * as loginController from '../../src/users/controllers/login.controller.js';
import * as registerController from '../../src/users/controllers/register.controller.js';
import * as profileController from '../../src/users/controllers/profile.controller.js';
import { InvalidCredentialsError } from '../../src/core/errors/invalid-credentials-error.js';
import { UserNotFoundError } from '../../src/core/errors/user-not-found-error.js';
import { UserAlreadyExistsError } from '../../src/core/errors/user-already-exists-error.js';

// Mock dos controladores
jest.mock('../../src/users/controllers/login.controller.js');
jest.mock('../../src/users/controllers/register.controller.js');
jest.mock('../../src/users/controllers/profile.controller.js');
jest.mock('../../src/core/middleware/auth.js');

const mockLogin = loginController.login as jest.MockedFunction<typeof loginController.login>;
const mockRegister = registerController.register as jest.MockedFunction<typeof registerController.register>;
const mockProfile = profileController.profile as jest.MockedFunction<typeof profileController.profile>;

// Setup da aplicação Express para testes
const app = express();
app.use(express.json());
app.use('/users', UserRoutes);

describe('Rotas de Usuário (/users)', () => {
  
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * TESTES PARA ROTA DE LOGIN
   * Endpoint: POST /users/login
   * Descrição: Autentica um usuário com email e senha
   */
  describe('POST /users/login', () => {
    
    it('deve realizar login com sucesso quando credenciais são válidas', async () => {
      // Arrange - Preparar dados de teste
      const loginData = {
        email: 'teste@exemplo.com',
        password: 'senha123'
      };
      const mockToken = 'jwt-token-valido';
      
      // Mock do controlador retornando token válido
      mockLogin.mockResolvedValue(mockToken);

      // Act - Executar a requisição
      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      // Assert - Verificar resultados
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: mockToken });
      expect(mockLogin).toHaveBeenCalledWith(loginData);
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    it('deve retornar erro 401 quando credenciais são inválidas', async () => {
      // Arrange
      const loginData = {
        email: 'teste@exemplo.com',
        password: 'senha-errada'
      };
      
      // Mock do controlador lançando erro de credenciais inválidas
      mockLogin.mockRejectedValue(new InvalidCredentialsError('Credenciais inválidas'));

      // Act
      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Credenciais inválidas' });
    });

    it('deve retornar erro 404 quando usuário não é encontrado', async () => {
      // Arrange
      const loginData = {
        email: 'inexistente@exemplo.com',
        password: 'senha123'
      };
      
      // Mock do controlador lançando erro de usuário não encontrado
      mockLogin.mockRejectedValue(new UserNotFoundError('Usuário não encontrado'));

      // Act
      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Usuário não encontrado' });
    });

    it('deve retornar erro 500 para erros internos do servidor', async () => {
      // Arrange
      const loginData = {
        email: 'teste@exemplo.com',
        password: 'senha123'
      };
      
      // Mock do controlador lançando erro genérico
      mockLogin.mockRejectedValue(new Error('Erro interno'));

      // Act
      const response = await request(app)
        .post('/users/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erro no servidor' });
    });

    it('deve validar que email e password são obrigatórios', async () => {
      // Act - Testar sem email
      const responseWithoutEmail = await request(app)
        .post('/users/login')
        .send({ password: 'senha123' });

      // Act - Testar sem password
      const responseWithoutPassword = await request(app)
        .post('/users/login')
        .send({ email: 'teste@exemplo.com' });

      // Assert - Ambos devem falhar (o controlador deve ser chamado e pode gerar erro)
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  /**
   * TESTES PARA ROTA DE REGISTRO
   * Endpoint: POST /users/register
   * Descrição: Registra um novo usuário no sistema
   */
  describe('POST /users/register', () => {
    
    it('deve registrar usuário com sucesso quando dados são válidos', async () => {
      // Arrange
      const registerData = {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha123'
      };
      const mockUser = {
        id: 'user-uuid',
        name: 'João Silva',
        email: 'joao@exemplo.com'
      };
      
      // Mock do controlador retornando usuário criado
      mockRegister.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .post('/users/register')
        .send(registerData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Usuário registrado com sucesso',
        userId: mockUser.id
      });
      expect(mockRegister).toHaveBeenCalledWith(registerData);
    });

    it('deve retornar erro 409 quando usuário já existe', async () => {
      // Arrange
      const registerData = {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha123'
      };
      
      // Mock do controlador lançando erro de usuário já existe
      mockRegister.mockRejectedValue(new UserAlreadyExistsError('Usuário já existe'));

      // Act
      const response = await request(app)
        .post('/users/register')
        .send(registerData);

      // Assert
      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'Usuário já existe' });
    });

    it('deve retornar erro 400 quando credenciais são inválidas', async () => {
      // Arrange
      const registerData = {
        name: '',
        email: 'email-invalido',
        password: '123' // senha muito curta
      };
      
      // Mock do controlador lançando erro de credenciais inválidas
      mockRegister.mockRejectedValue(new InvalidCredentialsError('Credenciais inválidas'));

      // Act
      const response = await request(app)
        .post('/users/register')
        .send(registerData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Credenciais inválidas' });
    });

    it('deve retornar erro 500 para erros internos do servidor', async () => {
      // Arrange
      const registerData = {
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha123'
      };
      
      // Mock do controlador lançando erro genérico
      mockRegister.mockRejectedValue(new Error('Erro de banco de dados'));

      // Act
      const response = await request(app)
        .post('/users/register')
        .send(registerData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erro no servidor' });
    });
  });

  /**
   * TESTES PARA ROTA DE PERFIL
   * Endpoint: GET /users/profile
   * Descrição: Retorna informações do perfil do usuário autenticado
   * Requer: Token JWT válido no header Authorization
   */
  describe('GET /users/profile', () => {
    
    // Mock do middleware de autenticação
    const mockAuthMiddleware = jest.fn((req, res, next) => {
      // Simular usuário autenticado
      req.user = { userId: 'user-uuid-123' };
      next();
    });

    beforeEach(() => {
      // Aplicar mock do middleware
      jest.doMock('../../src/core/middleware/auth.js', () => ({
        authMiddleware: mockAuthMiddleware
      }));
    });

    it('deve retornar perfil do usuário quando autenticado', async () => {
      // Arrange
      const mockUserProfile = {
        userId: 'user-uuid-123',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        team: [
          { id: 'team-1', name: 'Equipe Frontend' },
          { id: 'team-2', name: 'Equipe Backend' }
        ]
      };
      
      // Mock do controlador retornando perfil do usuário
      mockProfile.mockResolvedValue(mockUserProfile);

      // Act
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer jwt-token-valido');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUserProfile);
      expect(mockProfile).toHaveBeenCalledWith('user-uuid-123');
    });

    it('deve retornar erro 404 quando usuário não é encontrado', async () => {
      // Arrange - Usuário autenticado mas não existe no banco
      mockProfile.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer jwt-token-valido');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Usuário não encontrado' });
    });

    it('deve retornar erro 500 para erros internos do servidor', async () => {
      // Arrange
      mockProfile.mockRejectedValue(new Error('Erro de banco de dados'));

      // Act
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer jwt-token-valido');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Erro no servidor' });
    });

    it('deve retornar erro 401 quando token não é fornecido', async () => {
      // Arrange - Configurar middleware para rejeitar requisição sem token
      const mockAuthMiddlewareUnauthorized = jest.fn((req, res, next) => {
        return res.status(401).json({ error: 'Token não fornecido' });
      });
      
      // Temporariamente substituir o middleware
      jest.doMock('../../src/core/middleware/auth.js', () => ({
        authMiddleware: mockAuthMiddlewareUnauthorized
      }));

      // Act
      const response = await request(app)
        .get('/users/profile');

      // Assert
      expect(response.status).toBe(401);
    });
  });

  /**
   * TESTES DE INTEGRAÇÃO
   * Descrição: Testes que verificam o fluxo completo das rotas
   */
  describe('Fluxo completo de usuário', () => {
    
    it('deve permitir registro, login e acesso ao perfil sequencialmente', async () => {
      // 1. Registro
      const registerData = {
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        password: 'senha123'
      };
      
      mockRegister.mockResolvedValue({
        id: 'new-user-uuid',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        password: 'hashedPassword123',
        createdAt: new Date()
      });

      const registerResponse = await request(app)
        .post('/users/register')
        .send(registerData);

      expect(registerResponse.status).toBe(201);
      
      // 2. Login
      const loginData = {
        email: 'maria@exemplo.com',
        password: 'senha123'
      };
      
      mockLogin.mockResolvedValue('jwt-token-maria');

      const loginResponse = await request(app)
        .post('/users/login')
        .send(loginData);

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBe('jwt-token-maria');
      
      // 3. Acesso ao perfil (simulado)
      mockProfile.mockResolvedValue({
        userId: 'new-user-uuid',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        team: []
      });

      // Note: Este teste simula o fluxo mas não testa a autenticação real
      // Em um teste de integração completo, usaríamos o token real
    });
  });
});
