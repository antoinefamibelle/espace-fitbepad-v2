import type { CollectionConfig } from 'payload'
import { destructiveOperationsAccess, operationsWriteAccess } from '../access/bridge'

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: {
    singular: 'Cours',
    plural: 'Cours',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'difficulty', 'price', 'isActive'],
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
    {
      name: 'category',
      label: 'Categorie',
      type: 'select',
      required: true,
      options: [
        { label: 'Fitness', value: 'fitness' },
        { label: 'Bien-etre', value: 'bien_etre' },
        { label: 'Padel', value: 'padel' },
        { label: 'Force', value: 'force' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'duration', label: 'Duree', type: 'text', required: true },
    {
      name: 'difficulty',
      label: 'Difficulte',
      type: 'select',
      required: true,
      options: [
        { label: 'Debutant', value: 'debutant' },
        { label: 'Intermediaire', value: 'intermediaire' },
        { label: 'Avance', value: 'avance' },
      ],
    },
    { name: 'maxParticipants', label: 'Participants maximum', type: 'number', required: true, min: 1 },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'benefits',
      label: 'Benefices',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'value', label: 'Benefice', type: 'text', required: true }],
    },
    {
      name: 'equipment',
      label: 'Equipements',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'value', label: 'Equipement', type: 'text', required: true }],
    },
    { name: 'price', label: 'Prix', type: 'number', required: true, min: 0 },
    {
      name: 'gradient',
      label: 'Degrade',
      type: 'select',
      required: true,
      options: [
        { label: 'Orange vers rouge', value: 'from-orange-400 to-red-500' },
        { label: 'Bleu vers violet', value: 'from-blue-400 to-purple-500' },
        { label: 'Vert vers emeraude', value: 'from-green-400 to-emerald-500' },
        { label: 'Rouge vers rose', value: 'from-red-400 to-pink-500' },
        { label: 'Violet vers indigo', value: 'from-purple-400 to-indigo-500' },
        { label: 'Jaune vers orange', value: 'from-yellow-400 to-orange-500' },
      ],
    },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true, index: true },
    { name: 'sortOrder', label: 'Ordre', type: 'number', defaultValue: 0 },
  ],
}
