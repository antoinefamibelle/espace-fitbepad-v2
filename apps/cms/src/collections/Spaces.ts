import type { CollectionConfig } from 'payload'
import { destructiveOperationsAccess, operationsWriteAccess } from '../access/bridge'

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  labels: {
    singular: 'Espace',
    plural: 'Espaces',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'capacity', 'hours', 'isActive'],
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
    { name: 'name', label: 'Nom', type: 'text', required: true },
    {
      name: 'category',
      label: 'Categorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Musculation et cardio', value: 'musculation_cardio' },
        { label: 'Sport de raquette', value: 'sport_raquette' },
        { label: 'Relaxation et recovery', value: 'relaxation_recovery' },
        { label: 'Training specialise', value: 'training_specialise' },
        { label: 'Relaxation', value: 'relaxation' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    {
      name: 'features',
      label: 'Caracteristiques',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'value', label: 'Caracteristique', type: 'text', required: true }],
    },
    {
      name: 'equipment',
      label: 'Equipements',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'value', label: 'Equipement', type: 'text', required: true }],
    },
    { name: 'capacity', label: 'Capacite', type: 'text', required: true },
    { name: 'hours', label: 'Horaires', type: 'text', required: true },
    {
      name: 'image',
      label: 'Image principale',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      label: 'Galerie',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Images secondaires pour l apercu galerie.',
      },
    },
    {
      name: 'amenities',
      label: 'Services inclus',
      type: 'array',
      fields: [{ name: 'value', label: 'Service', type: 'text', required: true }],
    },
    {
      name: 'specifications',
      label: 'Specifications techniques',
      type: 'group',
      fields: [
        { name: 'surface', label: 'Surface', type: 'text', required: true },
        { name: 'temperature', label: 'Temperature', type: 'text', required: true },
        { name: 'ventilation', label: 'Ventilation', type: 'text', required: true },
        { name: 'sound', label: 'Son', type: 'text', required: true },
      ],
    },
    {
      name: 'gradient',
      label: 'Degrade',
      type: 'select',
      required: true,
      options: [
        { label: 'Bleu vers violet', value: 'from-blue-500 to-purple-600' },
        { label: 'Vert vers emeraude', value: 'from-green-500 to-emerald-600' },
        { label: 'Rose vers rouge', value: 'from-pink-500 to-rose-600' },
        { label: 'Orange vers rouge', value: 'from-orange-500 to-red-600' },
        { label: 'Cyan vers bleu', value: 'from-cyan-500 to-blue-600' },
      ],
    },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true, index: true },
    { name: 'sortOrder', label: 'Ordre', type: 'number', defaultValue: 0 },
  ],
}
