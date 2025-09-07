import prisma from '../../core/database/database.js';
import type { User, UserRole } from '../../../generated/prisma/index.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ 
      where: { email } 
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ 
      where: { id } as any
    });
  }

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    return prisma.user.create({ 
      data 
    });
  }

  async update(id: string, data: Partial<{ name: string; email: string; password: string; role: UserRole }>): Promise<User> {
    return prisma.user.update({
      where: { id } as any,
      data
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id } as any
    });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }

  async findUserTeams(userId: string): Promise<{ id: string; name: string }[]> {
    const teams = await prisma.$queryRaw`
      SELECT t.id, t.name 
      FROM "Team" t
      INNER JOIN "TeamMember" tm ON t.id = tm."teamId"
      WHERE tm."userId" = ${userId}
    `;

    return teams as { id: string; name: string }[];
  }

  async findTeamMembership(userId: string, teamId: string): Promise<{ role: string } | null> {
    return prisma.teamMember.findFirst({
      where: {
        userId: userId,
        teamId: teamId
      },
      select: {
        role: true
      }
    });
  }

}

export const userRepository = new UserRepository();
