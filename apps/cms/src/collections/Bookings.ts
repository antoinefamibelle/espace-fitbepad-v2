import type { CollectionConfig } from 'payload'
import {
  adminOrBridgeBookingCreate,
  adminOrBridgeBookingRead,
  adminOrBridgeBookingUpdate,
  destructiveOperationsAccess,
} from '../access/bridge'

import { computeBookingTotals } from './hooks/computeBookingTotals'
import { enforceBookingRules } from './hooks/enforceBookingRules'
import { incrementCouponUsage } from './hooks/incrementCouponUsage'
import { preventBookingConflict } from './hooks/preventBookingConflict'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Reservation',
    plural: 'Reservations',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'coach', 'service', 'startTime', 'status', 'paymentStatus'],
    group: 'Opérations',
  },
  access: {
    read: adminOrBridgeBookingRead,
    create: adminOrBridgeBookingCreate,
    update: adminOrBridgeBookingUpdate,
    delete: destructiveOperationsAccess,
  },
  hooks: {
    beforeValidate: [enforceBookingRules, preventBookingConflict],
    beforeChange: [computeBookingTotals],
    afterChange: [incrementCouponUsage],
  },
  fields: [
    { name: 'user', label: 'Client', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'coach', label: 'Coach', type: 'relationship', relationTo: 'coaches', required: true, index: true },
    { name: 'service', label: 'Service', type: 'relationship', relationTo: 'services', required: true, index: true },
    {
      name: 'startTime',
      label: 'Heure de début',
      type: 'date',
      required: true,
      index: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'endTime', label: 'Heure de fin', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'timezone', label: 'Fuseau horaire', type: 'text', required: true, defaultValue: 'UTC' },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      required: true,
      defaultValue: 'pending_payment',
      index: true,
      options: [
        { label: 'Paiement en attente', value: 'pending_payment' },
        { label: 'Confirmé', value: 'confirmed' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Annulé', value: 'cancelled' },
        { label: 'Annulé', value: 'canceled' },
        { label: 'Absence', value: 'no_show' },
        { label: 'Paiement échoué', value: 'failed_payment' },
      ],
    },
    {
      name: 'paymentStatus',
      label: 'Statut du paiement',
      type: 'select',
      required: true,
      defaultValue: 'unpaid',
      index: true,
      options: [
        { label: 'Non payé', value: 'unpaid' },
        { label: 'Payé', value: 'paid' },
        { label: 'Remboursé', value: 'refunded' },
        { label: 'Échoué', value: 'failed' },
        { label: 'Expiré', value: 'expired' },
      ],
    },
    { name: 'stripeCheckoutSessionId', label: 'Stripe Checkout Session ID', type: 'text', index: true },
    { name: 'stripePaymentIntentId', label: 'Stripe Payment Intent ID', type: 'text', index: true },
    { name: 'payment', label: 'Paiement', type: 'relationship', relationTo: 'payments' },
    { name: 'coupon', label: 'Coupon', type: 'relationship', relationTo: 'coupons' },
    { name: 'priceCents', label: 'Prix (centimes)', type: 'number', required: true, min: 0 },
    { name: 'discountCents', label: 'Remise (centimes)', type: 'number', defaultValue: 0, min: 0 },
    { name: 'totalCents', label: 'Total (centimes)', type: 'number', required: true, min: 0 },
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
    { name: 'customerNotes', label: 'Notes du client', type: 'textarea' },
    { name: 'internalNotes', label: 'Notes internes', type: 'textarea' },
    { name: 'cancellationReason', label: "Motif d'annulation", type: 'textarea' },
    { name: 'cancelledAt', label: 'Annulé le', type: 'date' },
    { name: 'meetingUrl', label: 'Lien de réunion', type: 'text' },
    { name: 'reminderSent48h', label: 'Rappel 48h envoyé', type: 'checkbox', defaultValue: false },
    { name: 'reminderSent24h', label: 'Rappel 24h envoyé', type: 'checkbox', defaultValue: false },
  ],
}
