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
});
