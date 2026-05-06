// Admin Permissions System Types

export type Permission = 'create' | 'read' | 'update' | 'delete';

export type AdminResource = 
  | 'bookings'
  | 'centers'
  | 'treatments'
  | 'specialists'
  | 'users'
  | 'subscriptions'
  | 'subscription_plans'
  | 'payment_links'
  | 'mailing'
  | 'dashboard'
  | 'admin_permissions';

export interface ResourcePermission {
  resource: AdminResource;
  permissions: Permission[];
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean; // Cannot be deleted (e.g., Super Admin)
  permissions: ResourcePermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserRole {
  id: string;
  userId: string;
  roleId: string;
  centerId?: string; // Optional: role applies to specific center
  assignedAt: Date;
  assignedBy: string;
}

// Helper type for checking permissions
export interface PermissionCheck {
  resource: AdminResource;
  action: Permission;
  centerId?: string;
}

// Default role definitions
export const DEFAULT_ROLES: Omit<AdminRole, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Super Admin',
    description: 'Full access to all resources and centers',
    isSystemRole: true,
    permissions: [
      { resource: 'bookings', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'centers', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'treatments', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'specialists', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'subscriptions', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'subscription_plans', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'payment_links', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'mailing', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'dashboard', permissions: ['read'] },
      { resource: 'admin_permissions', permissions: ['create', 'read', 'update', 'delete'] },
    ],
  },
  {
    name: 'Center Manager',
    description: 'Full access to center-specific resources',
    isSystemRole: true,
    permissions: [
      { resource: 'bookings', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'centers', permissions: ['read', 'update'] },
      { resource: 'treatments', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'specialists', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', permissions: ['read', 'update'] },
      { resource: 'subscriptions', permissions: ['read', 'update'] },
      { resource: 'payment_links', permissions: ['create', 'read', 'update'] },
      { resource: 'mailing', permissions: ['create', 'read'] },
      { resource: 'dashboard', permissions: ['read'] },
    ],
  },
  {
    name: 'Receptionist',
    description: 'Basic access for front desk operations',
    isSystemRole: true,
    permissions: [
      { resource: 'bookings', permissions: ['create', 'read', 'update'] },
      { resource: 'centers', permissions: ['read'] },
      { resource: 'treatments', permissions: ['read'] },
      { resource: 'specialists', permissions: ['read'] },
      { resource: 'users', permissions: ['read', 'update'] },
      { resource: 'dashboard', permissions: ['read'] },
    ],
  },
  {
    name: 'Marketing Manager',
    description: 'Access to marketing and customer data',
    isSystemRole: true,
    permissions: [
      { resource: 'users', permissions: ['read', 'update'] },
      { resource: 'subscriptions', permissions: ['read'] },
      { resource: 'mailing', permissions: ['create', 'read', 'update', 'delete'] },
      { resource: 'payment_links', permissions: ['create', 'read', 'update'] },
      { resource: 'dashboard', permissions: ['read'] },
    ],
  },
  {
    name: 'Read Only',
    description: 'View-only access to most resources',
    isSystemRole: true,
    permissions: [
      { resource: 'bookings', permissions: ['read'] },
      { resource: 'centers', permissions: ['read'] },
      { resource: 'treatments', permissions: ['read'] },
      { resource: 'specialists', permissions: ['read'] },
      { resource: 'users', permissions: ['read'] },
      { resource: 'subscriptions', permissions: ['read'] },
      { resource: 'subscription_plans', permissions: ['read'] },
      { resource: 'dashboard', permissions: ['read'] },
    ],
  },
];

// Resource descriptions for UI
export const RESOURCE_DESCRIPTIONS: Record<AdminResource, string> = {
  bookings: 'Gestion des réservations clients',
  centers: 'Gestion des centres et leurs informations',
  treatments: 'Gestion des services et traitements',
  specialists: 'Gestion des spécialistes et praticiens',
  users: 'Gestion des utilisateurs et clients',
  subscriptions: 'Gestion des abonnements utilisateurs',
  subscription_plans: 'Gestion des plans d\'abonnement',
  payment_links: 'Gestion des liens de paiement',
  mailing: 'Gestion des campagnes e-mail',
  dashboard: 'Accès au tableau de bord',
  admin_permissions: 'Gestion des permissions administrateurs',
};

// Permission descriptions for UI
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  create: 'Créer',
  read: 'Consulter',
  update: 'Modifier',
  delete: 'Supprimer',
};