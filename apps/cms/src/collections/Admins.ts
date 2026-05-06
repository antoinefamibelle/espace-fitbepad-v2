import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: {
    singular: 'Administrateur',
    plural: 'Administrateurs',
  },
  auth: {
    tokenExpiration: 7 * 24 * 60 * 60,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Système',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) =>
      user?.collection === 'admins' && ['superadmin', 'admin'].includes(user?.role),
    update: ({ req: { user } }) => user?.collection === 'admins' && user?.role === 'superadmin',
    delete: ({ req: { user } }) => user?.collection === 'admins' && user?.role === 'superadmin',
  },
  fields: [
    { name: 'firstName', label: 'Prenom', type: 'text', required: true },
    { name: 'lastName', label: 'Nom', type: 'text', required: true },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Super administrateur', value: 'superadmin' },
        { label: 'Administrateur', value: 'admin' },
        { label: 'Support', value: 'support' },
      ],
      access: {
        create: ({ req: { user } }) => user?.collection === 'admins' && user?.role === 'superadmin',
        update: ({ req: { user } }) => user?.collection === 'admins' && user?.role === 'superadmin',
      },
    },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true },
    {
      name: 'authProvider',
      label: 'Fournisseur OAuth',
      type: 'select',
      options: ['google'],
      admin: { readOnly: true },
    },
    {
      name: 'authProviderUserId',
      label: 'Identifiant fournisseur',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    { name: 'avatarUrl', label: 'Avatar', type: 'text', admin: { readOnly: true } },
    { name: 'lastSocialLoginAt', label: 'Derniere connexion sociale', type: 'date', admin: { readOnly: true } },
  ],
}
