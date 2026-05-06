import type { CollectionConfig } from 'payload'
import { destructiveOperationsAccess, operationsWriteAccess } from '../access/bridge'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: {
    singular: 'Abonnement',
    plural: 'Abonnements',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'offerLevel', 'price', 'period', 'isPopular', 'isActive'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
    create: operationsWriteAccess,
    update: operationsWriteAccess,
    delete: destructiveOperationsAccess,
  },
  fields: [
    { name: 'slug', label: 'Slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'subtitle', label: 'Sous-titre', type: 'text', required: true },
    {
      name: 'offerLevel',
      label: 'Niveau de l offre',
      type: 'select',
      required: true,
      options: [
        { label: 'Fitness', value: 'fitness' },
        { label: 'Dynamique', value: 'dynamique' },
        { label: 'Premium', value: 'premium' },
        { label: 'Espace', value: 'espace' },
      ],
    },
    { name: 'price', label: 'Prix', type: 'number', required: true, min: 0 },
    {
      name: 'period',
      label: 'Periode',
      type: 'select',
      required: true,
      defaultValue: 'mois',
      options: [
        { label: 'Mois', value: 'mois' },
        { label: 'An', value: 'an' },
      ],
    },
    { name: 'registrationFee', label: 'Frais d inscription', type: 'number', required: true, min: 0 },
    { name: 'isPopular', label: 'Offre populaire', type: 'checkbox', defaultValue: false },
    { name: 'isPremium', label: 'Offre premium', type: 'checkbox', defaultValue: false },
    {
      name: 'benefits',
      label: 'Benefices',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'value', label: 'Benefice', type: 'text', required: true }],
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    {
      name: 'gradient',
      label: 'Degrade',
      type: 'select',
      required: true,
      options: [
        { label: 'Noir vers noir', value: 'from-luxury-black to-luxury-black' },
        { label: 'Noir vers violet', value: 'from-luxury-black to-luxury-purple' },
        { label: 'Noir vers vert', value: 'from-luxury-black to-luxury-green' },
        { label: 'Noir vert violet', value: 'from-luxury-black via-luxury-green to-luxury-purple' },
      ],
    },
    {
      name: 'icon',
      label: 'Icone',
      type: 'select',
      required: true,
      options: [
        { label: 'Fitness (💪)', value: '💪' },
        { label: 'Dynamique (🧘)', value: '🧘' },
        { label: 'Premium (⭐)', value: '⭐' },
        { label: 'Espace (🏆)', value: '🏆' },
      ],
    },
    { name: 'ctaText', label: 'Texte du bouton', type: 'text', required: true },
    {
      name: 'restrictions',
      label: 'Restrictions',
      type: 'array',
      fields: [{ name: 'value', label: 'Restriction', type: 'text', required: true }],
    },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true, index: true },
    { name: 'sortOrder', label: 'Ordre', type: 'number', defaultValue: 0 },
  ],
}
