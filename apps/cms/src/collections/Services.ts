import type { CollectionConfig } from 'payload'
import {
  destructiveOperationsAccess,
  operationsWriteAccess,
} from '../access/bridge'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'priceCents', 'durationMinutes', 'isActive'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
    create: operationsWriteAccess,
    update: operationsWriteAccess,
    delete: destructiveOperationsAccess,
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', label: 'Description', type: 'richText' },
    { name: 'shortDescription', label: 'Description courte', type: 'textarea', maxLength: 280 },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: "Image d'affichage du service" },
    },
    {
      name: 'priceCents',
      label: 'Prix (centimes)',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Prix en centimes (ex : 5000 = 50,00 €)' },
    },
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
    { name: 'durationMinutes', label: 'Durée (minutes)', type: 'number', required: true, min: 5 },
    { name: 'bufferBeforeMinutes', label: 'Tampon avant (minutes)', type: 'number', defaultValue: 0 },
    { name: 'bufferAfterMinutes', label: 'Tampon après (minutes)', type: 'number', defaultValue: 0 },
    {
      name: 'eligibleCoaches',
      label: 'Coachs éligibles',
      type: 'relationship',
      relationTo: 'coaches',
      hasMany: true,
    },
    { name: 'maxAdvanceBookingDays', label: 'Réservation max (jours)', type: 'number', defaultValue: 60 },
    { name: 'minAdvanceBookingHours', label: 'Réservation min (heures)', type: 'number', defaultValue: 24 },
    { name: 'cancellationPolicyHours', label: "Politique d'annulation (heures)", type: 'number', defaultValue: 24 },
    { name: 'stripeProductId', label: 'Identifiant produit Stripe', type: 'text', admin: { readOnly: true } },
    { name: 'stripePriceId', label: 'Identifiant prix Stripe', type: 'text', admin: { readOnly: true } },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true, index: true },
    { name: 'sortOrder', label: 'Ordre', type: 'number', defaultValue: 0 },
  ],
}
