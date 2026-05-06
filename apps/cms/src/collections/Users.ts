import type { CollectionConfig } from 'payload'
import {
  adminOrBridgeUserCreate,
  adminOrBridgeUserRead,
  adminOrBridgeUserUpdate,
  destructiveOperationsAccess,
} from '../access/bridge'
import { renderForgotPasswordEmail } from '../email-templates/forgotPassword'
import { validatePasswordStrength } from '../lib/password'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Client',
    plural: 'Clients',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'createdAt'],
    group: 'Clients',
  },
  auth: {
    tokenExpiration: 3600,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    useAPIKey: true,
    forgotPassword: {
      generateEmailHTML: (args) => {
        const { token = '', user } = args ?? {}
        const clientUrl = process.env.CLIENT_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`

        return renderForgotPasswordEmail({
          resetUrl,
          firstName: typeof user?.firstName === 'string' ? user.firstName : undefined,
        })
      },
      generateEmailSubject: () => 'Reset your password',
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const password = typeof data?.password === 'string' ? data.password : null
        if (!password) return data

        const passwordError = validatePasswordStrength(password)
        if (passwordError) {
          throw new Error(passwordError)
        }

        return data
      },
    ],
  },
  access: {
    read: adminOrBridgeUserRead,
    create: adminOrBridgeUserCreate,
    update: adminOrBridgeUserUpdate,
    delete: destructiveOperationsAccess,
  },
  fields: [
    { name: 'firstName', label: 'Prénom', type: 'text' },
    { name: 'lastName', label: 'Nom', type: 'text' },
    { name: 'phone', label: 'Téléphone', type: 'text' },
    { name: 'address', label: 'Adresse', type: 'text' },
    { name: 'city', label: 'Ville', type: 'text' },
    { name: 'zipCode', label: 'Code postal', type: 'text' },
    {
      name: 'isAdmin',
      label: 'Est administrateur',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Indicateur de compatibilité frontend (hérité)' },
    },
    {
      name: 'locale',
      label: 'Langue',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'Anglais', value: 'en' },
        { label: 'Français', value: 'fr' },
      ],
    },
    { name: 'timezone', label: 'Fuseau horaire', type: 'text', defaultValue: 'UTC' },
    {
      name: 'authProvider',
      label: 'Fournisseur OAuth',
      type: 'select',
      options: ['google'],
      admin: {
        readOnly: true,
        description: "Dernier fournisseur social utilisé pour s'authentifier.",
      },
    },
    {
      name: 'authProviderUserId',
      label: 'Identifiant fournisseur',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Identifiant utilisateur fournisseur (sujet Google).',
      },
    },
    {
      name: 'emailVerifiedAt',
      label: 'Email vérifié le',
      type: 'date',
      admin: { readOnly: true },
    },
    { name: 'avatarUrl', label: 'Avatar', type: 'text', admin: { readOnly: true } },
    { name: 'marketingOptIn', label: 'Consentement marketing', type: 'checkbox', defaultValue: false },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      admin: { description: 'Notes internes (non visibles par le client)' },
    },
  ],
}
