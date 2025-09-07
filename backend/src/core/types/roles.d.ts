export declare enum UserRole {
    USER = "USER",
    SUPPORT = "SUPPORT"
}
export declare enum TeamMemberRole {
    MEMBER = "MEMBER",
    ADMIN = "ADMIN"
}
export interface UserWithRole {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
}
export interface TeamMemberWithRole {
    id: string;
    userId: string;
    teamId: string;
    role: TeamMemberRole;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
export interface TeamWithMembers {
    id: string;
    name: string;
    createdAt: Date;
    members: TeamMemberWithRole[];
}
export declare const USER_PERMISSIONS: {
    USER: string[];
    SUPPORT: string[];
};
export declare const TEAM_MEMBER_PERMISSIONS: {
    MEMBER: string[];
    ADMIN: string[];
};
export declare function hasUserPermission(userRole: UserRole, permission: string): boolean;
export declare function hasTeamMemberPermission(memberRole: TeamMemberRole, permission: string): boolean;
export declare function isTeamAdmin(memberRole: TeamMemberRole): boolean;
export declare function isSupport(userRole: UserRole): boolean;
//# sourceMappingURL=roles.d.ts.map