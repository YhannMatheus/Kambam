import { projectRepository, type Project, type CreateProjectData } from '../domain/project.repository.js';

export async function createProject(data: CreateProjectData): Promise<Project> {
    return await projectRepository.create(data);
}

export async function getProjectById(id: string): Promise<Project | null> {
    return await projectRepository.findById(id);
}

export async function getAllProjects(): Promise<Project[]> {
    return await projectRepository.findAll();
}

export async function getProjectsByTeam(teamId: string): Promise<Project[]> {
    return await projectRepository.findByTeamId(teamId);
}

export async function updateProject(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    return await projectRepository.update(id, data);
}

export async function deleteProject(id: string): Promise<Project> {
    return await projectRepository.delete(id);
}
