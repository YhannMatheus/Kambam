// ========================================
// ADMIN ROUTES - Rotas administrativas
// ========================================

import { Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.js';
import { requireSupport } from '../../core/middleware/roles.js';
import { listAllUsers, changeUserRole, getSystemStats } from '../controllers/admin.controller.js';

const router = Router();

// Todas as rotas admin requerem autenticação e role SUPPORT
router.use(authMiddleware);
router.use(requireSupport);

// GET /api/admin/users - Listar todos os usuários
router.get('/users', listAllUsers);

// PUT /api/admin/users/:userId/role - Alterar role de um usuário
router.put('/users/:userId/role', changeUserRole);

// GET /api/admin/stats - Obter estatísticas do sistema
router.get('/stats', getSystemStats);

export const AdminRoutes = router;
