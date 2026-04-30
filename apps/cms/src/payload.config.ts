import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fr } from 'payload/i18n/fr'
import path from 'path'
import { fileURLToPath } from 'url'

import { Admins } from './collections/Admins'
import { Bookings } from './collections/Bookings'
import { Coaches } from './collections/Coaches'
import { CouponUsages } from './collections/CouponUsages'
import { Coupons } from './collections/Coupons'
import { Courses } from './collections/Courses'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PaymentLinks } from './collections/PaymentLinks'
import { Payments } from './collections/Payments'
import { Services } from './collections/Services'
import { Spaces } from './collections/Spaces'
import { Subscriptions } from './collections/Subscriptions'
import { availabilityOccupancyEndpoint } from './endpoints/availabilityOccupancy'
import { bridgeUserResolveEndpoint } from './endpoints/bridgeUserResolve'
import { createCheckoutSessionEndpoint } from './endpoints/createCheckoutSession'
import { stripeWebhookEndpoint } from './endpoints/stripeWebhook'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Admins.slug,
    meta: {
      titleSuffix: '— Administration Coaching',
    },
  },
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  collections: [
    Admins,
    Users,
    Coaches,
    Services,
    Courses,
    Spaces,
    Subscriptions,
    Bookings,
    Payments,
    PaymentLinks,
    Coupons,
    CouponUsages,
    Media,
  ],
  endpoints: [
    availabilityOccupancyEndpoint,
    bridgeUserResolveEndpoint,
    createCheckoutSessionEndpoint,
    stripeWebhookEndpoint,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp: (await import('sharp')).default,
  cors: process.env.CORS_ORIGINS?.split(',') ?? [],
  csrf: process.env.CORS_ORIGINS?.split(',') ?? [],
})
