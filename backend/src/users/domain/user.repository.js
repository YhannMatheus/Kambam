import prisma from '../../core/database/database.js';
export class UserRepository {
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id }
        });
    }
    async create(data) {
        return prisma.user.create({
            data
        });
    }
    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return prisma.user.delete({
            where: { id }
        });
    }
    async findAll() {
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
    async findUserTeams(userId) {
        const teams = await prisma.$queryRaw `
      SELECT t.id, t.name 
      FROM "Team" t
      INNER JOIN "TeamMember" tm ON t.id = tm."teamId"
      WHERE tm."userId" = ${userId}
    `;
        return teams;
    }
    async findTeamMembership(userId, teamId) {
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
//# sourceMappingURL=user.repository.js.map