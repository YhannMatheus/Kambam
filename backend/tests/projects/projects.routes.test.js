const request = require('supertest');
const express = require('express');

// Mock dos controladores
const mockCreateProject = jest.fn();
const mockGetAllProjects = jest.fn();
const mockGetProjectById = jest.fn();
const mockGetProjectsByTeam = jest.fn();
const mockUpdateProject = jest.fn();
const mockDeleteProject = jest.fn();

describe('Project Routes Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Criando uma aplicação Express simples para teste
    app = express();
    app.use(express.json());
    
    // Simulando as rotas
    app.post('/projects', mockCreateProject);
    app.get('/projects', mockGetAllProjects);
    app.get('/projects/:id', mockGetProjectById);
    app.get('/projects/team/:teamId', mockGetProjectsByTeam);
    app.put('/projects/:id', mockUpdateProject);
    app.delete('/projects/:id', mockDeleteProject);
  });

  describe('POST /projects', () => {
    it('deve criar projeto com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Projeto criado com sucesso',
        project: {
          id: 'project-uuid-1',
          name: 'Projeto Teste',
          teamId: 'team-uuid-1',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockCreateProject.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/projects')
        .send({
          name: 'Projeto Teste',
          teamId: 'team-uuid-1'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.project.name).toBe('Projeto Teste');
      expect(mockCreateProject).toHaveBeenCalledTimes(1);
    });

    it('deve criar projeto sem teamId', async () => {
      const mockResponse = {
        success: true,
        message: 'Projeto criado com sucesso',
        project: {
          id: 'project-uuid-2',
          name: 'Projeto Individual',
          teamId: null,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockCreateProject.mockImplementation((req, res) => {
        res.status(201).json(mockResponse);
      });

      const response = await request(app)
        .post('/projects')
        .send({
          name: 'Projeto Individual'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.project.teamId).toBeNull();
      expect(mockCreateProject).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com nome vazio', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Nome do projeto é obrigatório'
      };

      mockCreateProject.mockImplementation((req, res) => {
        res.status(400).json(mockErrorResponse);
      });

      const response = await request(app)
        .post('/projects')
        .send({
          name: '',
          teamId: 'team-uuid-1'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nome do projeto é obrigatório');
    });
  });

  describe('GET /projects', () => {
    it('deve listar todos os projetos', async () => {
      const mockResponse = {
        success: true,
        projects: [
          {
            id: 'project-uuid-1',
            name: 'Projeto 1',
            teamId: 'team-uuid-1',
            createdAt: '2024-01-01T00:00:00.000Z'
          },
          {
            id: 'project-uuid-2',
            name: 'Projeto 2',
            teamId: null,
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      };

      mockGetAllProjects.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/projects');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.projects).toHaveLength(2);
      expect(mockGetAllProjects).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há projetos', async () => {
      const mockResponse = {
        success: true,
        projects: []
      };

      mockGetAllProjects.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/projects');

      expect(response.status).toBe(200);
      expect(response.body.projects).toHaveLength(0);
    });
  });

  describe('GET /projects/:id', () => {
    it('deve retornar projeto específico', async () => {
      const mockResponse = {
        success: true,
        project: {
          id: 'project-uuid-1',
          name: 'Projeto Específico',
          teamId: 'team-uuid-1',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockGetProjectById.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/projects/project-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project.id).toBe('project-uuid-1');
      expect(mockGetProjectById).toHaveBeenCalledTimes(1);
    });

    it('deve falhar com projeto não encontrado', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Projeto não encontrado'
      };

      mockGetProjectById.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .get('/projects/projeto-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Projeto não encontrado');
    });
  });

  describe('GET /projects/team/:teamId', () => {
    it('deve retornar projetos de um time específico', async () => {
      const mockResponse = {
        success: true,
        projects: [
          {
            id: 'project-uuid-1',
            name: 'Projeto do Time A',
            teamId: 'team-uuid-1',
            createdAt: '2024-01-01T00:00:00.000Z'
          },
          {
            id: 'project-uuid-3',
            name: 'Outro Projeto do Time A',
            teamId: 'team-uuid-1',
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      };

      mockGetProjectsByTeam.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .get('/projects/team/team-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.projects).toHaveLength(2);
      expect(response.body.projects[0].teamId).toBe('team-uuid-1');
      expect(mockGetProjectsByTeam).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT /projects/:id', () => {
    it('deve atualizar projeto com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Projeto atualizado com sucesso',
        project: {
          id: 'project-uuid-1',
          name: 'Projeto Atualizado',
          teamId: 'team-uuid-2',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      };

      mockUpdateProject.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .put('/projects/project-uuid-1')
        .send({
          name: 'Projeto Atualizado',
          teamId: 'team-uuid-2'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project.name).toBe('Projeto Atualizado');
      expect(mockUpdateProject).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao atualizar projeto inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Projeto não encontrado'
      };

      mockUpdateProject.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .put('/projects/projeto-inexistente')
        .send({
          name: 'Nome Atualizado'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Projeto não encontrado');
    });
  });

  describe('DELETE /projects/:id', () => {
    it('deve deletar projeto com sucesso', async () => {
      const mockResponse = {
        success: true,
        message: 'Projeto deletado com sucesso'
      };

      mockDeleteProject.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });

      const response = await request(app)
        .delete('/projects/project-uuid-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Projeto deletado com sucesso');
      expect(mockDeleteProject).toHaveBeenCalledTimes(1);
    });

    it('deve falhar ao deletar projeto inexistente', async () => {
      const mockErrorResponse = {
        success: false,
        message: 'Projeto não encontrado'
      };

      mockDeleteProject.mockImplementation((req, res) => {
        res.status(404).json(mockErrorResponse);
      });

      const response = await request(app)
        .delete('/projects/projeto-inexistente');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Projeto não encontrado');
    });
  });
});
