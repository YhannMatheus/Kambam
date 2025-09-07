// ========================================
// TYPES E ENUMS PARA SISTEMA DE ROLES
// ========================================

export enum UserRole {
  USER = 'USER',
  SUPPORT = 'SUPPORT'
}

export enum TeamMemberRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
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
export function hasUserPermission(userRole: UserRole, permission: string): boolean {
  return USER_PERMISSIONS[userRole]?.includes(permission) || false;
}

export function hasTeamMemberPermission(memberRole: TeamMemberRole, permission: string): boolean {
  return TEAM_MEMBER_PERMISSIONS[memberRole]?.includes(permission) || false;
}

export function isTeamAdmin(memberRole: TeamMemberRole): boolean {
  return memberRole === TeamMemberRole.ADMIN;
}

export function isSupport(userRole: UserRole): boolean {
  return userRole === UserRole.SUPPORT;
}
