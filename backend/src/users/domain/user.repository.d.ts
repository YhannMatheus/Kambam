import type { User, UserRole } from '../../../generated/prisma/index.js';
export declare class UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<User>;
    update(id: string, data: Partial<{
        name: string;
        email: string;
        password: string;
        role: UserRole;
    }>): Promise<User>;
    delete(id: string): Promise<User>;
    findAll(): Promise<Omit<User, 'password'>[]>;
    findUserTeams(userId: string): Promise<{
        id: string;
        name: string;
    }[]>;
    findTeamMembership(userId: string, teamId: string): Promise<{
        role: string;
    } | null>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repository.d.ts.map