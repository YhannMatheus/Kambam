import prisma from '@/core/database/database.js';
class ProjectRepository {
    async create(data) {
        return prisma.project.create({
            data: {
                name: data.name,
                teamId: data.teamId || null
            }
        });
    }
    async findById(id) {
        return prisma.project.findUnique({
            where: { id }
        });
    }
    async findByTeamId(teamId) {
        return prisma.project.findMany({
            where: { teamId }
        });
    }
    async findAll() {
        return prisma.project.findMany();
    }
    async update(id, data) {
        return prisma.project.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return prisma.project.delete({
            where: { id }
        });
    }
}
export const projectRepository = new ProjectRepository();
//# sourceMappingURL=project.repository.js.map