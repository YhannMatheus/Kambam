// ========================================
// ADMIN CONTROLLER - Para operações administrativas
// ========================================
import { userRepository } from '../../users/domain/user.repository.js';
import { UserRole } from '../../core/types/roles.js';
// Listar todos os usuários (apenas suporte)
export async function listAllUsers(req, res) {
    try {
        const users = await userRepository.findAll();
        res.json({
            message: 'Usuários listados com sucesso',
            users: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }))
        });
    }
    catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
// Alterar role de um usuário (apenas suporte)
export async function changeUserRole(req, res) {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!userId) {
            res.status(400).json({ error: 'ID do usuário é obrigatório' });
            return;
        }
        // Validar role
        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({
                error: 'Role inválido. Valores permitidos: ' + Object.values(UserRole).join(', ')
            });
            return;
        }
        // Buscar usuário
        const user = await userRepository.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }
        // Atualizar role
        const updatedUser = await userRepository.update(userId, { role });
        res.json({
            message: 'Role do usuário alterado com sucesso',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt
            }
        });
    }
    catch (error) {
        console.error('Erro ao alterar role do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
// Obter estatísticas do sistema (apenas suporte)
export async function getSystemStats(req, res) {
    try {
        // Implementar contagem de usuários, projetos, etc.
        const totalUsers = await userRepository.findAll();
        res.json({
            message: 'Estatísticas do sistema',
            stats: {
                totalUsers: totalUsers.length,
                usersByRole: {
                    USER: totalUsers.filter(u => u.role === UserRole.USER).length,
                    SUPPORT: totalUsers.filter(u => u.role === UserRole.SUPPORT).length
                },
                // Adicionar mais estatísticas conforme necessário
            }
        });
    }
    catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
//# sourceMappingURL=admin.controller.js.map