import Stripe from 'stripe'

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2026-04-22.dahlia'

let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required')
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
  })

  return stripeClient
}
