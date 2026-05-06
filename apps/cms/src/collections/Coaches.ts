import type { CollectionConfig } from 'payload'
import {
  destructiveOperationsAccess,
  operationsWriteAccess,
} from '../access/bridge'

export const Coaches: CollectionConfig = {
  slug: 'coaches',
  labels: {
    singular: 'Coach',
    plural: 'Coachs',
  },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'email', 'isActive'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
    create: operationsWriteAccess,
    update: operationsWriteAccess,
    delete: destructiveOperationsAccess,
  },
  fields: [
    { name: 'displayName', label: 'Nom affiche', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true, unique: true, index: true },
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true, unique: true },
    { name: 'phone', label: 'Telephone', type: 'text' },
    { name: 'marketingBio', label: 'Biographie (site vitrine)', type: 'textarea' },
    { name: 'experience', label: 'Experience', type: 'text' },
    { name: 'quote', label: 'Citation', type: 'textarea' },
    { name: 'bio', label: 'Biographie', type: 'richText' },
    {
      name: 'profilePicture',
      label: 'Photo de profil',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Photo du coach utilisee dans le catalogue et les fiches.' },
    },
    {
      name: 'cardGradient',
      label: 'Degrade de carte',
      type: 'select',
      defaultValue: 'violet_rose',
      options: [
        { label: 'Violet vers rose', value: 'violet_rose' },
        { label: 'Vert vers emeraude', value: 'vert_emeraude' },
        { label: 'Bleu vers cyan', value: 'bleu_cyan' },
      ],
    },
    {
      name: 'category',
      label: 'Categorie',
      type: 'select',
      required: true,
      defaultValue: 'fitness',
      options: [
        { label: 'Fitness', value: 'fitness' },
        { label: 'Padel', value: 'padel' },
        { label: 'Wellness', value: 'wellness' },
      ],
    },
    { name: 'timezone', label: 'Fuseau horaire', type: 'text', required: true, defaultValue: 'UTC' },
    {
      name: 'specialties',
      label: 'Specialites',
      type: 'array',
      fields: [{ name: 'value', label: 'Valeur', type: 'text', required: true }],
    },
    {
      name: 'certifications',
      label: 'Certifications',
      type: 'array',
      fields: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'issuer', label: 'Organisme', type: 'text' },
        { name: 'year', label: 'Annee', type: 'number' },
      ],
    },
    {
      name: 'availability',
      label: 'Disponibilites',
      type: 'array',
      admin: { description: 'Disponibilites hebdomadaires recurrents' },
      fields: [
        {
          name: 'dayOfWeek',
          label: 'Jour',
          type: 'select',
          required: true,
          options: [
            { label: 'Lundi', value: '1' },
            { label: 'Mardi', value: '2' },
            { label: 'Mercredi', value: '3' },
            { label: 'Jeudi', value: '4' },
            { label: 'Vendredi', value: '5' },
            { label: 'Samedi', value: '6' },
            { label: 'Dimanche', value: '0' },
          ],
        },
        { name: 'startTime', label: 'Heure de debut', type: 'text', required: true, admin: { description: 'HH:mm' } },
        { name: 'endTime', label: 'Heure de fin', type: 'text', required: true, admin: { description: 'HH:mm' } },
      ],
    },
    {
      name: 'availabilityExceptions',
      label: 'Exceptions de disponibilite',
      type: 'array',
      admin: { description: 'Exceptions ponctuelles (jours feries, horaires speciaux)' },
      fields: [
        { name: 'date', label: 'Date', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'isAvailable', label: 'Disponible', type: 'checkbox', defaultValue: false },
        { name: 'startTime', label: 'Heure de debut', type: 'text', admin: { description: 'HH:mm (requis si disponible)' } },
        { name: 'endTime', label: 'Heure de fin', type: 'text', admin: { description: 'HH:mm (requis si disponible)' } },
      ],
    },
    { name: 'isActive', label: 'Actif', type: 'checkbox', defaultValue: true, index: true },
    { name: 'sortOrder', label: 'Ordre', type: 'number', defaultValue: 0 },
  ],
}
