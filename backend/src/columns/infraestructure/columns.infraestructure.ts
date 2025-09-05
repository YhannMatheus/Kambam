import { Router } from 'express';
import { 
    createColumn, 
    getColumnById, 
    getColumnsByProject, 
    updateColumn, 
    deleteColumn 
} from '../controllers/column.controller.js';
import { authMiddleware } from '../../core/middleware/auth.js';

interface CreateColumnBody {
    name: string;
    projectId: string;
    order: number;
}

interface UpdateColumnBody {
    name?: string;
    order?: number;
}

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
    const { name, projectId, order } = req.body as CreateColumnBody;
    
    try {
        const column = await createColumn({ name, projectId, order });
        res.status(201).json({
            message: 'Coluna criada com sucesso',
            column
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao criar coluna' });
    }
});

router.get('/project/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;
    
    if (!projectId) {
        res.status(400).json({ error: 'ID do projeto é obrigatório' });
        return;
    }
    
    try {
        const columns = await getColumnsByProject(projectId);
        res.json({ columns });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao buscar colunas' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        res.status(400).json({ error: 'ID da coluna é obrigatório' });
        return;
    }
    
    try {
        const column = await getColumnById(id);
        
        if (!column) {
            res.status(404).json({ error: 'Coluna não encontrada' });
            return;
        }
        
        res.json({ column });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao buscar coluna' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body as UpdateColumnBody;
    
    if (!id) {
        res.status(400).json({ error: 'ID da coluna é obrigatório' });
        return;
    }
    
    try {
        const column = await updateColumn(id, updateData);
        res.json({
            message: 'Coluna atualizada com sucesso',
            column
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao atualizar coluna' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        res.status(400).json({ error: 'ID da coluna é obrigatório' });
        return;
    }
    
    try {
        await deleteColumn(id);
        res.json({ message: 'Coluna deletada com sucesso' });
    } catch (error: any) {
        res.status(500).json({ error: 'Erro ao deletar coluna' });
    }
});

export const ColumnRoutes = router;
