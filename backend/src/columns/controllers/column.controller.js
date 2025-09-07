import { columnRepository } from '../domain/column.repository.js';
export async function createColumn(data) {
    return await columnRepository.create(data);
}
export async function getColumnById(id) {
    return await columnRepository.findById(id);
}
export async function getColumnsByProject(projectId) {
    return await columnRepository.findByProjectId(projectId);
}
export async function updateColumn(id, data) {
    return await columnRepository.update(id, data);
}
export async function deleteColumn(id) {
    return await columnRepository.delete(id);
}
//# sourceMappingURL=column.controller.js.map