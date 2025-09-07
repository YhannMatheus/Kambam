import { taskRepository } from '../domain/task.repository.js';
export async function createTask(data) {
    return await taskRepository.create(data);
}
export async function getTaskById(id) {
    return await taskRepository.findById(id);
}
export async function getTasksByColumn(columnId) {
    return await taskRepository.findByColumnId(columnId);
}
export async function updateTask(id, data) {
    return await taskRepository.update(id, data);
}
export async function deleteTask(id) {
    return await taskRepository.delete(id);
}
export async function moveTask(id, columnId, order) {
    return await taskRepository.moveToColumn(id, columnId, order);
}
//# sourceMappingURL=task.controller.js.map