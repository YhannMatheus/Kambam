import { type Project, type CreateProjectData } from '../domain/project.repository.js';
export declare function createProject(data: CreateProjectData): Promise<Project>;
export declare function getProjectById(id: string): Promise<Project | null>;
export declare function getAllProjects(): Promise<Project[]>;
export declare function getProjectsByTeam(teamId: string): Promise<Project[]>;
export declare function updateProject(id: string, data: Partial<CreateProjectData>): Promise<Project>;
export declare function deleteProject(id: string): Promise<Project>;
//# sourceMappingURL=project.controller.d.ts.map