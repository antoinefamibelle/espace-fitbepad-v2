import type { CollectionConfig } from 'payload'
import {
  destructiveOperationsAccess,
  operationsReadAccess,
  operationsWriteAccess,
} from '../access/bridge'

export const CouponUsages: CollectionConfig = {
  slug: 'coupon-usages',
  labels: {
    singular: 'Utilisation de coupon',
    plural: 'Utilisations de coupon',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['coupon', 'user', 'booking', 'discountAppliedCents', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    read: operationsReadAccess,
    create: operationsWriteAccess,
    update: () => false,
    delete: destructiveOperationsAccess,
  },
  fields: [
    { name: 'coupon', label: 'Coupon', type: 'relationship', relationTo: 'coupons', required: true, index: true },
    { name: 'user', label: 'Client', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'booking', label: 'Réservation', type: 'relationship', relationTo: 'bookings', index: true },
    { name: 'discountAppliedCents', label: 'Remise appliquée (centimes)', type: 'number', required: true, min: 0 },
  ],
}
