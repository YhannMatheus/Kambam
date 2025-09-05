import prisma from '@/core/database/database.js';

export interface Column {
    id: string;
    name: string;
    projectId: string;
    order: number;
}

export interface CreateColumnData {
    name: string;
    projectId: string;
    order: number;
}

class ColumnRepository {
    async create(data: CreateColumnData): Promise<Column> {
        return prisma.column.create({
            data
        });
    }

    async findById(id: string): Promise<Column | null> {
        return prisma.column.findUnique({
            where: { id }
        });
    }

    async findByProjectId(projectId: string): Promise<Column[]> {
        return prisma.column.findMany({
            where: { projectId },
            orderBy: { order: 'asc' }
        });
    }

    async update(id: string, data: Partial<CreateColumnData>): Promise<Column> {
        return prisma.column.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Column> {
        return prisma.column.delete({
            where: { id }
        });
    }
}

export const columnRepository = new ColumnRepository();
