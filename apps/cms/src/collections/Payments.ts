import type { CollectionConfig } from 'payload'
import {
  operationsReadOrBridgeSecretAccess,
  operationsWriteOrBridgeSecretAccess,
} from '../access/bridge'

export const Payments: CollectionConfig = {
  slug: 'payments',
  labels: {
    singular: 'Paiement',
    plural: 'Paiements',
  },
  admin: {
    useAsTitle: 'stripePaymentIntentId',
    defaultColumns: ['stripePaymentIntentId', 'amountCents', 'status', 'createdAt'],
    group: 'Commerce',
  },
  access: {
    read: operationsReadOrBridgeSecretAccess,
    create: operationsWriteOrBridgeSecretAccess,
    update: operationsWriteOrBridgeSecretAccess,
    delete: () => false,
  },
  fields: [
    { name: 'user', label: 'Client', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'booking', label: 'Réservation', type: 'relationship', relationTo: 'bookings', index: true },
    { name: 'stripePaymentIntentId', label: 'Identifiant intention de paiement Stripe', type: 'text', unique: true, index: true },
    { name: 'stripeCheckoutSessionId', label: 'Identifiant session de paiement Stripe', type: 'text', unique: true, index: true },
    { name: 'stripeChargeId', label: 'Identifiant charge Stripe', type: 'text' },
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
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Réussi', value: 'succeeded' },
        { label: 'Échoué', value: 'failed' },
        { label: 'Remboursé', value: 'refunded' },
        { label: 'Partiellement remboursé', value: 'partially_refunded' },
      ],
    },
    { name: 'refundedAmountCents', label: 'Montant remboursé (centimes)', type: 'number', defaultValue: 0 },
    { name: 'failureReason', label: "Motif d'échec", type: 'text' },
    { name: 'metadata', label: 'Métadonnées', type: 'json' },
  ],
}
