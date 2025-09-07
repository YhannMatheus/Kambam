import { type Column, type CreateColumnData } from '../domain/column.repository.js';
export declare function createColumn(data: CreateColumnData): Promise<Column>;
export declare function getColumnById(id: string): Promise<Column | null>;
export declare function getColumnsByProject(projectId: string): Promise<Column[]>;
export declare function updateColumn(id: string, data: Partial<CreateColumnData>): Promise<Column>;
export declare function deleteColumn(id: string): Promise<Column>;
//# sourceMappingURL=column.controller.d.ts.map