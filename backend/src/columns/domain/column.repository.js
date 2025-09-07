import prisma from '@/core/database/database.js';
class ColumnRepository {
    async create(data) {
        return prisma.column.create({
            data
        });
    }
    async findById(id) {
        return prisma.column.findUnique({
            where: { id }
        });
    }
    async findByProjectId(projectId) {
        return prisma.column.findMany({
            where: { projectId },
            orderBy: { order: 'asc' }
        });
    }
    async update(id, data) {
        return prisma.column.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return prisma.column.delete({
            where: { id }
        });
    }
}
export const columnRepository = new ColumnRepository();
//# sourceMappingURL=column.repository.js.map