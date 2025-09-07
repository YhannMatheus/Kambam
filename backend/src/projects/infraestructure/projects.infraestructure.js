import { Router } from 'express';
import { createProject, getProjectById, getAllProjects, updateProject, deleteProject } from '../controllers/project.controller.js';
import { authMiddleware } from '../../core/middleware/auth.js';
const router = Router();
// Todas as rotas de projeto precisam de autenticação
router.post('/', authMiddleware, async (req, res) => {
    const { name, teamId } = req.body;
    try {
        const projectData = {
            name,
            ...(teamId && { teamId })
        };
        const project = await createProject(projectData);
        res.status(201).json({
            message: 'Projeto criado com sucesso',
            project
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar projeto' });
    }
});
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.json({ projects });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'ID do projeto é obrigatório' });
        return;
    }
    try {
        const project = await getProjectById(id);
        if (!project) {
            res.status(404).json({ error: 'Projeto não encontrado' });
            return;
        }
        res.json({ project });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projeto' });
    }
});
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
        res.status(400).json({ error: 'ID do projeto é obrigatório' });
        return;
    }
    try {
        const project = await updateProject(id, updateData);
        res.json({
            message: 'Projeto atualizado com sucesso',
            project
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar projeto' });
    }
});
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: 'ID do projeto é obrigatório' });
        return;
    }
    try {
        await deleteProject(id);
        res.json({ message: 'Projeto deletado com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar projeto' });
    }
});
export const ProjectRoutes = router;
//# sourceMappingURL=projects.infraestructure.js.map