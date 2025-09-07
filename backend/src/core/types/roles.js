// ========================================
// TYPES E ENUMS PARA SISTEMA DE ROLES
// ========================================
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["SUPPORT"] = "SUPPORT";
})(UserRole || (UserRole = {}));
export var TeamMemberRole;
(function (TeamMemberRole) {
    TeamMemberRole["MEMBER"] = "MEMBER";
    TeamMemberRole["ADMIN"] = "ADMIN";
})(TeamMemberRole || (TeamMemberRole = {}));
// Permissões baseadas em roles
export const USER_PERMISSIONS = {
    [UserRole.USER]: [
        'create_project',
        'view_own_projects',
        'edit_own_projects',
        'delete_own_projects',
        'join_team',
        'leave_team'
    ],
    [UserRole.SUPPORT]: [
        'create_project',
        'view_own_projects',
        'edit_own_projects',
        'delete_own_projects',
        'join_team',
        'leave_team',
        'view_all_projects', // Permissões extras para suporte
        'moderate_content',
        'assist_users'
    ]
};
export const TEAM_MEMBER_PERMISSIONS = {
    [TeamMemberRole.MEMBER]: [
        'view_team_projects',
        'create_tasks',
        'edit_own_tasks',
        'comment_on_tasks'
    ],
    [TeamMemberRole.ADMIN]: [
        'view_team_projects',
        'create_tasks',
        'edit_own_tasks',
        'comment_on_tasks',
        'edit_all_tasks', // Permissões extras para admin
        'delete_tasks',
        'manage_team_members',
        'edit_team_settings',
        'create_team_projects',
        'delete_team_projects'
    ]
};
// Funções utilitárias para verificar permissões
export function hasUserPermission(userRole, permission) {
    return USER_PERMISSIONS[userRole]?.includes(permission) || false;
}
export function hasTeamMemberPermission(memberRole, permission) {
    return TEAM_MEMBER_PERMISSIONS[memberRole]?.includes(permission) || false;
}
export function isTeamAdmin(memberRole) {
    return memberRole === TeamMemberRole.ADMIN;
}
export function isSupport(userRole) {
    return userRole === UserRole.SUPPORT;
}
//# sourceMappingURL=roles.js.map