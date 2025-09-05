import prisma from '@/core/database/database.js';

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

class ProjectRepository {
    async create(data: CreateProjectData): Promise<Project> {
        return prisma.project.create({
            data: {
                name: data.name,
                teamId: data.teamId || null
            }
        });
    }

    async findById(id: string): Promise<Project | null> {
        return prisma.project.findUnique({
            where: { id }
        });
    }

    async findByTeamId(teamId: string): Promise<Project[]> {
        return prisma.project.findMany({
            where: { teamId }
        });
    }

    async findAll(): Promise<Project[]> {
        return prisma.project.findMany();
    }

    async update(id: string, data: Partial<CreateProjectData>): Promise<Project> {
        return prisma.project.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Project> {
        return prisma.project.delete({
            where: { id }
        });
    }
}

export const projectRepository = new ProjectRepository();
