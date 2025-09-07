import type { Request, Response, NextFunction } from 'express';
import { UserRole, TeamMemberRole } from '../types/roles.js';
export declare function requireUserRole(allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function requireUserPermission(permission: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function requireTeamRole(allowedRoles: TeamMemberRole[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function requireTeamPermission(permission: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireSupport: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireTeamAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function requireSupportOrTeamAdmin(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=roles.d.ts.map