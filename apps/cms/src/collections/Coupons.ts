import type { CollectionConfig } from 'payload'
import {
  destructiveOperationsAccess,
  operationsReadAccess,
  operationsWriteAccess,
} from '../access/bridge'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: {
    singular: 'Coupon',
    plural: 'Coupons',
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'isActive', 'expiresAt'],
    group: 'Commerce',
  },
  access: {
    read: operationsReadAccess,
    create: operationsWriteAccess,
    update: operationsWriteAccess,
    delete: destructiveOperationsAccess,
  },
  fields: [
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value)],
      },
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'discountType',
      label: 'Type de remise',
      type: 'select',
      required: true,
      options: [
        { label: 'Pourcentage', value: 'percentage' },
        { label: 'Montant fixe (centimes)', value: 'fixed' },
      ],
    },
    { name: 'discountValue', label: 'Valeur de la remise', type: 'number', required: true, min: 0 },
    {
      name: 'maxRedemptions',
      label: 'Utilisations maximum',
      type: 'number',
      admin: { description: 'Utilisations totales pour tous les clients. Laisser vide pour illimité.' },
    },
    { name: 'maxRedemptionsPerUser', label: 'Utilisations max par utilisateur', type: 'number', defaultValue: 1 },
    { name: 'redemptionCount', label: "Nombre d'utilisations", type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'minOrderCents', label: 'Commande minimum (centimes)', type: 'number', defaultValue: 0 },
    {
      name: 'applicableServices',
      label: 'Services applicables',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Laisser vide pour appliquer à tous les services' },
    },
    { name: 'startsAt', label: 'Début le', type: 'date' },
    { name: 'expiresAt', label: 'Expire le', type: 'date', index: true },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true, index: true },
  ],
}
