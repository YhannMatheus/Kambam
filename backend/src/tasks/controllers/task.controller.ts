import { taskRepository, type Task, type CreateTaskData } from '../domain/task.repository.js';

export async function createTask(data: CreateTaskData): Promise<Task> {
    return await taskRepository.create(data);
}

export async function getTaskById(id: string): Promise<Task | null> {
    return await taskRepository.findById(id);
}

export async function getTasksByColumn(columnId: string): Promise<Task[]> {
    return await taskRepository.findByColumnId(columnId);
}

export async function updateTask(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    return await taskRepository.update(id, data);
}

export async function deleteTask(id: string): Promise<Task> {
    return await taskRepository.delete(id);
}

export async function moveTask(id: string, columnId: string, order: number): Promise<Task> {
    return await taskRepository.moveToColumn(id, columnId, order);
}
