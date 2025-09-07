import { type Task, type CreateTaskData } from '../domain/task.repository.js';
export declare function createTask(data: CreateTaskData): Promise<Task>;
export declare function getTaskById(id: string): Promise<Task | null>;
export declare function getTasksByColumn(columnId: string): Promise<Task[]>;
export declare function updateTask(id: string, data: Partial<CreateTaskData>): Promise<Task>;
export declare function deleteTask(id: string): Promise<Task>;
export declare function moveTask(id: string, columnId: string, order: number): Promise<Task>;
//# sourceMappingURL=task.controller.d.ts.map