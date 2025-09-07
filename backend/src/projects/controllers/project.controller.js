import { projectRepository } from '../domain/project.repository.js';
export async function createProject(data) {
    return await projectRepository.create(data);
}
export async function getProjectById(id) {
    return await projectRepository.findById(id);
}
export async function getAllProjects() {
    return await projectRepository.findAll();
}
export async function getProjectsByTeam(teamId) {
    return await projectRepository.findByTeamId(teamId);
}
export async function updateProject(id, data) {
    return await projectRepository.update(id, data);
}
export async function deleteProject(id) {
    return await projectRepository.delete(id);
}
//# sourceMappingURL=project.controller.js.map