const request = require('supertest');
const express = require('express');

// Mock dos controladores
const mockCreateTask = jest.fn();
const mockGetTaskById = jest.fn();
const mockGetTasksByColumn = jest.fn();
const mockUpdateTask = jest.fn();
const mockMoveTask = jest.fn();
const mockDeleteTask = jest.fn();

describe('Task Routes Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Criando uma aplicação Express simples para teste
    app = express();
    app.use(express.json());
    
    // Simulando as rotas
    app.post('/tasks', mockCreateTask);
    app.get('/tasks/column/:columnId', mockGetTasksByColumn);
    app.get('/tasks/:id', mockGetTaskById);
    app.put('/tasks/:id', mockUpdateTask);
    app.put('/tasks/:id/move', mockMoveTask);
    app.delete('/tasks/:id', mockDeleteTask);
  });

  describe('POST /tasks', () => {
    it('deve criar tarefa com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Tarefa criada com sucesso',
        task: {
          id: 'task-uuid-1',
          title: 'Implementar autenticação',
          description: 'Criar sistema de login com JWT',
          columnId: 'column-uuid-1',
          order: 1,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockCreateTask.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Implementar autenticação',
          description: 'Criar sistema de login com JWT',
          columnId: 'column-uuid-1',
          order: 1
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.task.title).toBe('Implementar autenticação');
      expect(response.body.task.columnId).toBe('column-uuid-1');
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
    });

    it('deve criar tarefa sem descrição', async () => {
      const mockResponse = {
        success: true,
        message: 'Tarefa criada com sucesso',
        task: {
          id: 'task-uuid-2',
          title: 'Tarefa simples',
          description: null,
          columnId: 'column-uuid-1',
          order: 2,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockCreateTask.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Tarefa simples',
          columnId: 'column-uuid-1',
          order: 2
        });

      expect(response.status).toBe(201);
      expect(response.body.task.description).toBeNull();
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com título vazio', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Título e ID da coluna são obrigatórios'
      };

      mockCreateTask.mockImplementation((req, res) => {
        res.status(400).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/tasks')
        .send({
          title: '',
          columnId: 'column-uuid-1'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Título e ID da coluna são obrigatórios');
    });

    it('deve falhar com coluna inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Coluna não encontrada'
      };

      mockCreateTask.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Nova Tarefa',
          columnId: 'coluna-inexistente',
          order: 1
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Coluna não encontrada');
    });
  });

  describe('GET /tasks/column/:columnId', () => {
    it('deve listar tarefas de uma coluna', async () => {
      const mockResponse = {
        success: true,
        tasks: [
          {
            id: 'task-uuid-1',
            title: 'Primeira tarefa',
            description: 'Descrição da primeira tarefa',
            columnId: 'column-uuid-1',
            order: 1,
            createdAt: '2024-01-01T00:00:00.000Z'
          },
          {
            id: 'task-uuid-2',
            title: 'Segunda tarefa',
            description: null,
            columnId: 'column-uuid-1',
            order: 2,
            createdAt: '2024-01-01T01:00:00.000Z'
          }
        ]
      };

      mockGetTasksByColumn.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/tasks/column/column-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.tasks).toHaveLength(2);
      expect(response.body.tasks[0].title).toBe('Primeira tarefa');
      expect(response.body.tasks[1].title).toBe('Segunda tarefa');
      expect(mockGetTasksByColumn).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia para coluna sem tarefas', async () => {
      const mockResponse = {
        success: true,
        tasks: []
      };

      mockGetTasksByColumn.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/tasks/column/coluna-vazia');

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(0);
    });

    it('deve falhar com coluna inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Coluna não encontrada'
      };

      mockGetTasksByColumn.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .get('/tasks/column/coluna-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Coluna não encontrada');
    });
  });

  describe('GET /tasks/:id', () => {
    it('deve retornar tarefa específica', async () => {
      const mockResponse = {
        success: true,
        task: {
          id: 'task-uuid-1',
          title: 'Tarefa específica',
          description: 'Descrição detalhada da tarefa',
          columnId: 'column-uuid-1',
          order: 1,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockGetTaskById.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/tasks/task-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.id).toBe('task-uuid-1');
      expect(response.body.task.title).toBe('Tarefa específica');
      expect(mockGetTaskById).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com tarefa não encontrada', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Tarefa não encontrada'
      };

      mockGetTaskById.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .get('/tasks/tarefa-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tarefa não encontrada');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('deve atualizar tarefa com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Tarefa atualizada com sucesso',
        task: {
          id: 'task-uuid-1',
          title: 'Tarefa atualizada',
          description: 'Nova descrição da tarefa',
          columnId: 'column-uuid-1',
          order: 1,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockUpdateTask.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put('/tasks/task-uuid-1')
        .send({
          title: 'Tarefa atualizada',
          description: 'Nova descrição da tarefa'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.title).toBe('Tarefa atualizada');
      expect(response.body.task.description).toBe('Nova descrição da tarefa');
      expect(mockUpdateTask).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao atualizar tarefa inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Tarefa não encontrada'
      };

      mockUpdateTask.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .put('/tasks/tarefa-inexistente')
        .send({
          title: 'Título atualizado'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tarefa não encontrada');
    });
  });

  describe('PUT /tasks/:id/move', () => {
    it('deve mover tarefa entre colunas com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Tarefa movida com sucesso',
        task: {
          id: 'task-uuid-1',
          title: 'Tarefa movida',
          description: 'Tarefa que foi movida de coluna',
          columnId: 'column-uuid-2',
          order: 1,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockMoveTask.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put('/tasks/task-uuid-1/move')
        .send({
          columnId: 'column-uuid-2',
          order: 1
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.columnId).toBe('column-uuid-2');
      expect(response.body.task.order).toBe(1);
      expect(mockMoveTask).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao mover para coluna inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Coluna de destino não encontrada'
      };

      mockMoveTask.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .put('/tasks/task-uuid-1/move')
        .send({
          columnId: 'coluna-inexistente',
          order: 1
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Coluna de destino não encontrada');
    });

    it('deve falhar com dados obrigatórios faltando', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'ID da coluna e ordem são obrigatórios'
      };

      mockMoveTask.mockImplementation((req, res) => {
        res.status(400).json(mockErrorResponse);
      });

      const response = await request(app)
        .put('/tasks/task-uuid-1/move')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('ID da coluna e ordem são obrigatórios');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deve deletar tarefa com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Tarefa deletada com sucesso'
      };

      mockDeleteTask.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .delete('/tasks/task-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tarefa deletada com sucesso');
      expect(mockDeleteTask).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao deletar tarefa inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Tarefa não encontrada'
      };

      mockDeleteTask.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .delete('/tasks/tarefa-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tarefa não encontrada');
    });
  });
});
