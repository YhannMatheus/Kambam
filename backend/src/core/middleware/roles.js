// ========================================
// MIDDLEWARE PARA CONTROLE DE ROLES E PERMISSÕES
// ========================================
import { UserRole, TeamMemberRole, hasUserPermission, hasTeamMemberPermission, isSupport } from '../types/roles.js';
import { userRepository } from '../../users/domain/user.repository.js';
// Middleware para verificar role de usuário
export function requireUserRole(allowedRoles) {
    return async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: 'Usuário não autenticado' });
                return;
            }
            // Buscar role do usuário no banco
            const user = await userRepository.findById(req.user.userId);
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado' });
                return;
            }
            const userRole = user.role;
            // Verificar se o role do usuário está permitido
            if (!allowedRoles.includes(userRole)) {
                res.status(403).json({
                    error: 'Acesso negado. Role necessário: ' + allowedRoles.join(' ou '),
                    userRole: userRole
                });
                return;
            }
            // Armazenar role para uso posterior
            req.userRole = userRole;
            next();
        }
        catch (error) {
            console.error('Erro ao verificar role do usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
}
// Middleware para verificar permissão específica de usuário
export function requireUserPermission(permission) {
    return async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: 'Usuário não autenticado' });
                return;
            }
            // Buscar role do usuário
            const user = await userRepository.findById(req.user.userId);
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado' });
                return;
            }
            const userRole = user.role;
            // Verificar se o usuário tem a permissão
            if (!hasUserPermission(userRole, permission)) {
                res.status(403).json({
                    error: `Acesso negado. Permissão necessária: ${permission}`,
                    userRole: userRole
                });
                return;
            }
            req.userRole = userRole;
            next();
        }
        catch (error) {
            console.error('Erro ao verificar permissão do usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
}
// Middleware para verificar role em equipe específica
export function requireTeamRole(allowedRoles) {
    return async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: 'Usuário não autenticado' });
                return;
            }
            // Obter teamId dos parâmetros da rota
            const teamId = req.params.teamId;
            if (!teamId) {
                res.status(400).json({ error: 'ID da equipe é obrigatório' });
                return;
            }
            // Buscar membership do usuário na equipe
            const teamMember = await userRepository.findTeamMembership(req.user.userId, teamId);
            if (!teamMember) {
                res.status(403).json({ error: 'Usuário não é membro desta equipe' });
                return;
            }
            const memberRole = teamMember.role;
            // Verificar se o role na equipe está permitido
            if (!allowedRoles.includes(memberRole)) {
                res.status(403).json({
                    error: 'Acesso negado na equipe. Role necessário: ' + allowedRoles.join(' ou '),
                    teamRole: memberRole
                });
                return;
            }
            // Armazenar informações da equipe
            req.teamMember = {
                userId: req.user.userId,
                teamId: teamId,
                role: memberRole
            };
            next();
        }
        catch (error) {
            console.error('Erro ao verificar role da equipe:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
}
// Middleware para verificar permissão específica em equipe
export function requireTeamPermission(permission) {
    return async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: 'Usuário não autenticado' });
                return;
            }
            const teamId = req.params.teamId;
            if (!teamId) {
                res.status(400).json({ error: 'ID da equipe é obrigatório' });
                return;
            }
            // Buscar membership do usuário na equipe
            const teamMember = await userRepository.findTeamMembership(req.user.userId, teamId);
            if (!teamMember) {
                res.status(403).json({ error: 'Usuário não é membro desta equipe' });
                return;
            }
            const memberRole = teamMember.role;
            // Verificar se o usuário tem a permissão na equipe
            if (!hasTeamMemberPermission(memberRole, permission)) {
                res.status(403).json({
                    error: `Acesso negado na equipe. Permissão necessária: ${permission}`,
                    teamRole: memberRole
                });
                return;
            }
            req.teamMember = {
                userId: req.user.userId,
                teamId: teamId,
                role: memberRole
            };
            next();
        }
        catch (error) {
            console.error('Erro ao verificar permissão da equipe:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
}
// Middleware para permitir apenas suporte
export const requireSupport = requireUserRole([UserRole.SUPPORT]);
// Middleware para permitir apenas administradores de equipe
export const requireTeamAdmin = requireTeamRole([TeamMemberRole.ADMIN]);
// Middleware que permite suporte ou admin da equipe
export function requireSupportOrTeamAdmin() {
    return async (req, res, next) => {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: 'Usuário não autenticado' });
                return;
            }
            // Verificar se é suporte
            const user = await userRepository.findById(req.user.userId);
            if (user && isSupport(user.role)) {
                req.userRole = user.role;
                next();
                return;
            }
            // Se não é suporte, verificar se é admin da equipe
            const teamId = req.params.teamId;
            if (!teamId) {
                res.status(400).json({ error: 'ID da equipe é obrigatório' });
                return;
            }
            const teamMember = await userRepository.findTeamMembership(req.user.userId, teamId);
            if (!teamMember || teamMember.role !== TeamMemberRole.ADMIN) {
                res.status(403).json({
                    error: 'Acesso negado. Necessário ser suporte ou administrador da equipe'
                });
                return;
            }
            req.teamMember = {
                userId: req.user.userId,
                teamId: teamId,
                role: teamMember.role
            };
            next();
        }
        catch (error) {
            console.error('Erro ao verificar permissões:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
}
//# sourceMappingURL=roles.js.map