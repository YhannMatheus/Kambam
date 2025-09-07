import prisma from '@/core/database/database.js';
class TaskRepository {
    async create(data) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description || null,
                columnId: data.columnId,
                order: data.order
            }
        });
    }
    async findById(id) {
        return prisma.task.findUnique({
            where: { id }
        });
    }
    async findByColumnId(columnId) {
        return prisma.task.findMany({
            where: { columnId },
            orderBy: { order: 'asc' }
        });
    }
    async update(id, data) {
        return prisma.task.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return prisma.task.delete({
            where: { id }
        });
    }
    async moveToColumn(id, columnId, order) {
        return prisma.task.update({
            where: { id },
            data: { columnId, order }
        });
    }
}
export const taskRepository = new TaskRepository();
//# sourceMappingURL=task.repository.js.map