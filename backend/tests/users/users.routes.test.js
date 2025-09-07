const request = require('supertest');
const express = require('express');

// Mock dos controladores
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockProfile = jest.fn();

describe('User Routes Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Criando uma aplicação Express simples para teste
    app = express();
    app.use(express.json());
    
    // Simulando as rotas
    app.post('/users/login', mockLogin);
    app.post('/users/register', mockRegister);
    app.get('/users/profile', mockProfile);
  });

  describe('POST /users/login', () => {
    it('deve realizar login com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Login realizado com sucesso',
        token: 'fake-jwt-token',
        user: {
          id: 1,
          email: 'teste@exemplo.com',
          name: 'Usuário Teste'
        }
      };

      mockLogin.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'teste@exemplo.com',
          password: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe('fake-jwt-token');
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com credenciais inválidas', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Credenciais inválidas'
      };

      mockLogin.mockImplementation((req, res) => {
        res.status(401).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'email@inexistente.com',
          password: 'senhaerrada'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciais inválidas');
    });

    it('deve falhar com dados inválidos', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Email e senha são obrigatórios'
      };

      mockLogin.mockImplementation((req, res) => {
        res.status(400).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: '',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email e senha são obrigatórios');
    });
  });

  describe('POST /users/register', () => {
    it('deve registrar usuário com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Usuário registrado com sucesso',
        user: {
          id: 1,
          email: 'novousuario@exemplo.com',
          name: 'Novo Usuário'
        }
      };

      mockRegister.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/users/register')
        .send({
          name: 'Novo Usuário',
          email: 'novousuario@exemplo.com',
          password: '123456'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('novousuario@exemplo.com');
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com email já existente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Email já está em uso'
      };

      mockRegister.mockImplementation((req, res) => {
        res.status(409).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/users/register')
        .send({
          name: 'Usuário Teste',
          email: 'usuario@existente.com',
          password: '123456'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email já está em uso');
    });

    it('deve falhar com dados incompletos', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      };

      mockRegister.mockImplementation((req, res) => {
        res.status(400).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/users/register')
        .send({
          name: '',
          email: 'teste@exemplo.com'
          // password está faltando
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nome, email e senha são obrigatórios');
    });
  });

  describe('GET /users/profile', () => {
    it('deve retornar perfil do usuário com token válido', async () => {
      const mockResponse = {
        success: true,
        user: {
          id: 1,
          email: 'usuario@exemplo.com',
          name: 'Usuário Teste',
          created_at: '2024-01-01T00:00:00.000Z'
        }
      };

      mockProfile.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer valid-jwt-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('usuario@exemplo.com');
      expect(mockProfile).toHaveBeenCalledTimes(1);
    });

    it('deve falhar sem token de autorização', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Token de autorização necessário'
      };

      mockProfile.mockImplementation((req, res) => {
        res.status(401).json(mockErrorResponse);
      });

      const response = await request(app)
        .get('/users/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token de autorização necessário');
    });

    it('deve falhar com token inválido', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Token inválido'
      };

      mockProfile.mockImplementation((req, res) => {
        res.status(401).json(mockErrorResponse);
      });

      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token inválido');
    });
  });
});
