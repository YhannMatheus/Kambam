import { columnRepository, type Column, type CreateColumnData } from '../domain/column.repository.js';

export async function createColumn(data: CreateColumnData): Promise<Column> {
    return await columnRepository.create(data);
}

export async function getColumnById(id: string): Promise<Column | null> {
    return await columnRepository.findById(id);
}

export async function getColumnsByProject(projectId: string): Promise<Column[]> {
    return await columnRepository.findByProjectId(projectId);
}

export async function updateColumn(id: string, data: Partial<CreateColumnData>): Promise<Column> {
    return await columnRepository.update(id, data);
}

export async function deleteColumn(id: string): Promise<Column> {
    return await columnRepository.delete(id);
}
