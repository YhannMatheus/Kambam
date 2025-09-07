// ========================================
// TEAM CONTROLLER - Para operações de equipe com roles
// ========================================

import type { Request, Response } from 'express';
import { TeamMemberRole } from '../../core/types/roles.js';
import prisma from '../../core/database/database.js';

// Adicionar membro à equipe (apenas admins da equipe)
export async function addTeamMember(req: Request, res: Response) {
  try {
    const { teamId } = req.params;
    const { userId, role = TeamMemberRole.MEMBER } = req.body;

    if (!teamId || !userId) {
      res.status(400).json({ error: 'ID da equipe e do usuário são obrigatórios' });
      return;
    }

    // Validar role
    if (!Object.values(TeamMemberRole).includes(role)) {
      res.status(400).json({ 
        error: 'Role inválido. Valores permitidos: ' + Object.values(TeamMemberRole).join(', ')
      });
      return;
    }

    // Verificar se o usuário já é membro da equipe
    const existingMember = await prisma.teamMember.findFirst({
      where: { userId, teamId }
    });

    if (existingMember) {
      res.status(409).json({ error: 'Usuário já é membro desta equipe' });
      return;
    }

    // Verificar se a equipe existe
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      res.status(404).json({ error: 'Equipe não encontrada' });
      return;
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Adicionar membro à equipe
    const teamMember = await prisma.teamMember.create({
      data: {
        userId,
        teamId,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Membro adicionado à equipe com sucesso',
      teamMember: {
        id: teamMember.id,
        role: teamMember.role,
        user: teamMember.user
      }
    });

  } catch (error) {
    console.error('Erro ao adicionar membro à equipe:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Remover membro da equipe (apenas admins da equipe)
export async function removeTeamMember(req: Request, res: Response) {
  try {
    const { teamId, userId } = req.params;

    if (!teamId || !userId) {
      res.status(400).json({ error: 'ID da equipe e do usuário são obrigatórios' });
      return;
    }

    // Verificar se o membro existe
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId, teamId }
    });

    if (!teamMember) {
      res.status(404).json({ error: 'Usuário não é membro desta equipe' });
      return;
    }

    // Verificar se não está tentando remover o último admin
    const adminCount = await prisma.teamMember.count({
      where: { 
        teamId, 
        role: TeamMemberRole.ADMIN 
      }
    });

    if (teamMember.role === TeamMemberRole.ADMIN && adminCount <= 1) {
      res.status(400).json({ 
        error: 'Não é possível remover o último administrador da equipe' 
      });
      return;
    }

    // Remover membro
    await prisma.teamMember.delete({
      where: { id: teamMember.id }
    });

    res.json({
      message: 'Membro removido da equipe com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover membro da equipe:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Alterar role de membro da equipe (apenas admins da equipe)
export async function changeTeamMemberRole(req: Request, res: Response) {
  try {
    const { teamId, userId } = req.params;
    const { role } = req.body;

    if (!teamId || !userId) {
      res.status(400).json({ error: 'ID da equipe e do usuário são obrigatórios' });
      return;
    }

    // Validar role
    if (!Object.values(TeamMemberRole).includes(role)) {
      res.status(400).json({ 
        error: 'Role inválido. Valores permitidos: ' + Object.values(TeamMemberRole).join(', ')
      });
      return;
    }

    // Verificar se o membro existe
    const teamMember = await prisma.teamMember.findFirst({
      where: { userId, teamId }
    });

    if (!teamMember) {
      res.status(404).json({ error: 'Usuário não é membro desta equipe' });
      return;
    }

    // Se está rebaixando um admin, verificar se não é o último
    if (teamMember.role === TeamMemberRole.ADMIN && role === TeamMemberRole.MEMBER) {
      const adminCount = await prisma.teamMember.count({
        where: { 
          teamId, 
          role: TeamMemberRole.ADMIN 
        }
      });

      if (adminCount <= 1) {
        res.status(400).json({ 
          error: 'Não é possível rebaixar o último administrador da equipe' 
        });
        return;
      }
    }

    // Atualizar role
    const updatedMember = await prisma.teamMember.update({
      where: { id: teamMember.id },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Role do membro alterado com sucesso',
      teamMember: {
        id: updatedMember.id,
        role: updatedMember.role,
        user: updatedMember.user
      }
    });

  } catch (error) {
    console.error('Erro ao alterar role do membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Listar membros da equipe com seus roles
export async function listTeamMembers(req: Request, res: Response) {
  try {
    const { teamId } = req.params;

    if (!teamId) {
      res.status(400).json({ error: 'ID da equipe é obrigatório' });
      return;
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: [
        { role: 'asc' }, // ADMINs primeiro
        { user: { name: 'asc' } }
      ]
    });

    res.json({
      message: 'Membros da equipe listados com sucesso',
      members: members.map(member => ({
        id: member.id,
        teamRole: member.role,
        user: member.user
      }))
    });

  } catch (error) {
    console.error('Erro ao listar membros da equipe:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
