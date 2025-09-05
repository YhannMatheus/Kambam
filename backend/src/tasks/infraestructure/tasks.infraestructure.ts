import { Router } from 'express';
import { 
    createTask, 
    getTaskById, 
    getTasksByColumn, 
    updateTask, 
    deleteTask, 
    moveTask 
} from '../controllers/task.controller.js';
import { authMiddleware } from '../../core/middleware/auth.js';

interface CreateTaskBody {
    title: string;
    description?: string;
    columnId: string;
    order: number;
}

interface UpdateTaskBody {
    title?: string;
    description?: string;
    order?: number;
}

interface MoveTaskBody {
    columnId: string;
    order: number;
}

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
    const { title, description, columnId, order } = req.body as CreateTaskBody;
    
    try {
        const taskData = {
            title,
            columnId,
            order,
            ...(description && { description })
        };
        const task = await createTask(taskData);
        res.status(201).json({
            message: 'Tarefa criada com sucesso',
            task
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
});

router.get('/column/:columnId', authMiddleware, async (req, res) => {
    const { columnId } = req.params;
    
    if (!columnId) {
        res.status(400).json({ error: 'ID da coluna é obrigatório' });
        return;
    }
    
    try {
        const tasks = await getTasksByColumn(columnId);
        res.json({ tasks });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        res.status(400).json({ error: 'ID da tarefa é obrigatório' });
        return;
    }
    
    try {
        const task = await getTaskById(id);
        
        if (!task) {
            res.status(404).json({ error: 'Tarefa não encontrada' });
            return;
        }
        
        res.json({ task });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body as UpdateTaskBody;
    
    if (!id) {
        res.status(400).json({ error: 'ID da tarefa é obrigatório' });
        return;
    }
    
    try {
        const task = await updateTask(id, updateData);
        res.json({
            message: 'Tarefa atualizada com sucesso',
            task
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

router.put('/:id/move', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { columnId, order } = req.body as MoveTaskBody;
    
    if (!id) {
        res.status(400).json({ error: 'ID da tarefa é obrigatório' });
        return;
    }
    
    try {
        const task = await moveTask(id, columnId, order);
        res.json({
            message: 'Tarefa movida com sucesso',
            task
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao mover tarefa' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        res.status(400).json({ error: 'ID da tarefa é obrigatório' });
        return;
    }
    
    try {
        await deleteTask(id);
        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
});

export const TaskRoutes = router;
