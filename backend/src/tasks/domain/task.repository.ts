import prisma from '@/core/database/database.js';

export interface Task {
    id: string;
    title: string;
    description: string | null;
    columnId: string;
    order: number;
    createdAt: Date;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    columnId: string;
    order: number;
}

class TaskRepository {
    async create(data: CreateTaskData): Promise<Task> {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description || null,
                columnId: data.columnId,
                order: data.order
            }
        });
    }

    async findById(id: string): Promise<Task | null> {
        return prisma.task.findUnique({
            where: { id }
        });
    }

    async findByColumnId(columnId: string): Promise<Task[]> {
        return prisma.task.findMany({
            where: { columnId },
            orderBy: { order: 'asc' }
        });
    }

    async update(id: string, data: Partial<CreateTaskData>): Promise<Task> {
        return prisma.task.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Task> {
        return prisma.task.delete({
            where: { id }
        });
    }

    async moveToColumn(id: string, columnId: string, order: number): Promise<Task> {
        return prisma.task.update({
            where: { id },
            data: { columnId, order }
        });
    }
}

export const taskRepository = new TaskRepository();
