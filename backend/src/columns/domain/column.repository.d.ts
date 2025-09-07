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
declare class ColumnRepository {
    create(data: CreateColumnData): Promise<Column>;
    findById(id: string): Promise<Column | null>;
    findByProjectId(projectId: string): Promise<Column[]>;
    update(id: string, data: Partial<CreateColumnData>): Promise<Column>;
    delete(id: string): Promise<Column>;
}
export declare const columnRepository: ColumnRepository;
export {};
//# sourceMappingURL=column.repository.d.ts.map