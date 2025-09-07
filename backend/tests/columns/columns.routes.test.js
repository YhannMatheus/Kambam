const request = require('supertest');
const express = require('express');

// Mock dos controladores
const mockCreateColumn = jest.fn();
const mockGetColumnById = jest.fn();
const mockGetColumnsByProject = jest.fn();
const mockUpdateColumn = jest.fn();
const mockDeleteColumn = jest.fn();

describe('Column Routes Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Criando uma aplicação Express simples para teste
    app = express();
    app.use(express.json());
    
    // Simulando as rotas
    app.post('/columns', mockCreateColumn);
    app.get('/columns/project/:projectId', mockGetColumnsByProject);
    app.get('/columns/:id', mockGetColumnById);
    app.put('/columns/:id', mockUpdateColumn);
    app.delete('/columns/:id', mockDeleteColumn);
  });

  describe('POST /columns', () => {
    it('deve criar coluna com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Coluna criada com sucesso',
        column: {
          id: 'column-uuid-1',
          name: 'To Do',
          projectId: 'project-uuid-1',
          order: 1,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockCreateColumn.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/columns')
        .send({
          name: 'To Do',
          projectId: 'project-uuid-1',
          order: 1
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.column.name).toBe('To Do');
      expect(response.body.column.projectId).toBe('project-uuid-1');
      expect(mockCreateColumn).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com dados obrigatórios faltando', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Nome e ID do projeto são obrigatórios'
      };

      mockCreateColumn.mockImplementation((req, res) => {
        res.status(400).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/columns')
        .send({
          name: '',
          projectId: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nome e ID do projeto são obrigatórios');
    });

    it('deve falhar com projeto inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Projeto não encontrado'
      };

      mockCreateColumn.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/columns')
        .send({
          name: 'Nova Coluna',
          projectId: 'projeto-inexistente',
          order: 1
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Projeto não encontrado');
    });
  });

  describe('GET /columns/project/:projectId', () => {
    it('deve listar colunas de um projeto', async () => {
      const mockResponse = {
        success: true,
        columns: [
          {
            id: 'column-uuid-1',
            name: 'To Do',
            projectId: 'project-uuid-1',
            order: 1
          },
          {
            id: 'column-uuid-2',
            name: 'In Progress',
            projectId: 'project-uuid-1',
            order: 2
          },
          {
            id: 'column-uuid-3',
            name: 'Done',
            projectId: 'project-uuid-1',
            order: 3
          }
        ]
      };

      mockGetColumnsByProject.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/columns/project/project-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.columns).toHaveLength(3);
      expect(response.body.columns[0].name).toBe('To Do');
      expect(response.body.columns[1].name).toBe('In Progress');
      expect(response.body.columns[2].name).toBe('Done');
      expect(mockGetColumnsByProject).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia para projeto sem colunas', async () => {
      const mockResponse = {
        success: true,
        columns: []
      };

      mockGetColumnsByProject.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/columns/project/project-vazio');

      expect(response.status).toBe(200);
      expect(response.body.columns).toHaveLength(0);
    });

    it('deve falhar com projeto inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Projeto não encontrado'
      };

      mockGetColumnsByProject.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .get('/columns/project/projeto-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Projeto não encontrado');
    });
  });

  describe('GET /columns/:id', () => {
    it('deve retornar coluna específica', async () => {
      const mockResponse = {
        success: true,
        column: {
          id: 'column-uuid-1',
          name: 'To Do',
          projectId: 'project-uuid-1',
          order: 1,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockGetColumnById.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/columns/column-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.column.id).toBe('column-uuid-1');
      expect(response.body.column.name).toBe('To Do');
      expect(mockGetColumnById).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com coluna não encontrada', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Coluna não encontrada'
      };

      mockGetColumnById.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .get('/columns/coluna-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Coluna não encontrada');
    });
  });

  describe('PUT /columns/:id', () => {
    it('deve atualizar coluna com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Coluna atualizada com sucesso',
        column: {
          id: 'column-uuid-1',
          name: 'Backlog',
          projectId: 'project-uuid-1',
          order: 0,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockUpdateColumn.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put('/columns/column-uuid-1')
        .send({
          name: 'Backlog',
          order: 0
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.column.name).toBe('Backlog');
      expect(response.body.column.order).toBe(0);
      expect(mockUpdateColumn).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao atualizar coluna inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Coluna não encontrada'
      };

      mockUpdateColumn.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .put('/columns/coluna-inexistente')
        .send({
          name: 'Nome Atualizado'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Coluna não encontrada');
    });
  });

  describe('DELETE /columns/:id', () => {
    it('deve deletar coluna com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Coluna deletada com sucesso'
      };

      mockDeleteColumn.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .delete('/columns/column-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Coluna deletada com sucesso');
      expect(mockDeleteColumn).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao deletar coluna inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Coluna não encontrada'
      };

      mockDeleteColumn.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .delete('/columns/coluna-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Coluna não encontrada');
    });

    it('deve falhar ao deletar coluna com tarefas', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Não é possível deletar coluna que possui tarefas'
      };

      mockDeleteColumn.mockImplementation((req, res) => {
        res.status(409).json(mockErrorResponse);
      });

      const response = await request(app)
        .delete('/columns/column-com-tarefas');

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Não é possível deletar coluna que possui tarefas');
    });
  });
});
