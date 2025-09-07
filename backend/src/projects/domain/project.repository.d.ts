export interface Project {
    id: string;
    name: string;
    teamId: string | null;
    createdAt: Date;
}
export interface CreateProjectData {
    name: string;
    teamId?: string;
}
declare class ProjectRepository {
    create(data: CreateProjectData): Promise<Project>;
    findById(id: string): Promise<Project | null>;
    findByTeamId(teamId: string): Promise<Project[]>;
    findAll(): Promise<Project[]>;
    update(id: string, data: Partial<CreateProjectData>): Promise<Project>;
    delete(id: string): Promise<Project>;
}
export declare const projectRepository: ProjectRepository;
export {};
//# sourceMappingURL=project.repository.d.ts.map