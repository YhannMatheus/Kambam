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
declare class TaskRepository {
    create(data: CreateTaskData): Promise<Task>;
    findById(id: string): Promise<Task | null>;
    findByColumnId(columnId: string): Promise<Task[]>;
    update(id: string, data: Partial<CreateTaskData>): Promise<Task>;
    delete(id: string): Promise<Task>;
    moveToColumn(id: string, columnId: string, order: number): Promise<Task>;
}
export declare const taskRepository: TaskRepository;
export {};
//# sourceMappingURL=task.repository.d.ts.map