import type { CollectionConfig } from 'payload'
import {
  destructiveOperationsAccess,
  operationsReadAccess,
  operationsWriteAccess,
} from '../access/bridge'

export const PaymentLinks: CollectionConfig = {
  slug: 'payment-links',
  labels: {
    singular: 'Lien de paiement',
    plural: 'Liens de paiement',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'amountCents', 'isActive', 'expiresAt'],
    group: 'Commerce',
  },
  access: {
    read: operationsReadAccess,
    create: operationsWriteAccess,
    update: operationsWriteAccess,
    delete: destructiveOperationsAccess,
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'amountCents', label: 'Montant (centimes)', type: 'number', required: true, min: 0 },
    {
      name: 'currency',
      label: 'Devise',
      type: 'select',
      required: true,
      defaultValue: 'usd',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'EUR', value: 'eur' },
        { label: 'CAD', value: 'cad' },
      ],
    },
    { name: 'service', label: 'Service', type: 'relationship', relationTo: 'services' },
    { name: 'coach', label: 'Coach', type: 'relationship', relationTo: 'coaches' },
    { name: 'stripePaymentLinkId', label: 'Identifiant lien de paiement Stripe', type: 'text', unique: true, admin: { readOnly: true } },
    { name: 'stripeUrl', label: 'URL Stripe', type: 'text', admin: { readOnly: true } },
    { name: 'maxUses', label: 'Utilisations maximum', type: 'number' },
    { name: 'useCount', label: "Nombre d'utilisations", type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'expiresAt', label: 'Expire le', type: 'date' },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true, index: true },
  ],
}
