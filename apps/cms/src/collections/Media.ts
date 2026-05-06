import type { CollectionConfig } from 'payload'
import {
  destructiveOperationsAccess,
  operationsWriteAccess,
} from '../access/bridge'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Medias',
  },
  admin: {
    group: 'Système',
  },
  access: {
    read: () => true,
    create: operationsWriteAccess,
    update: operationsWriteAccess,
    delete: destructiveOperationsAccess,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 200, height: 200, position: 'centre' },
      { name: 'card', width: 640, height: 480, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [{ name: 'alt', label: 'Texte alternatif', type: 'text', required: true }],
}
