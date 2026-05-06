import { Metadata } from 'next';

/** Public brand name — Espace Sport (salle de sport, padel, wellness). */
export const SITE_BRAND_NAME = 'Espace Sport';

const DEFAULT_SITE_URL = 'https://espacesports.com';
const DEFAULT_CONTACT_PHONE = '+33745175554';
const DEFAULT_CONTACT_EMAIL = 'contact@espacesports.com';

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL;
}

export function getContactPhone(): string {
  return process.env.NEXT_PUBLIC_CONTACT_PHONE || DEFAULT_CONTACT_PHONE;
}

export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL;
}

// French keywords — salle de sport, padel, wellness (Verberie / Oise)
export const SEO_KEYWORDS = {
  global: [
    'Espace Sport',
    'salle de sport Verberie',
    'fitness Verberie',
    'padel Oise',
    'padel Verberie',
    'wellness Oise',
    'centre bien-être Verberie',
    'musculation',
    'cardio training',
    'cours collectifs fitness',
    'récupération sportive',
    'coaching sportif',
    'club sportif Verberie',
    '60410',
    'Oise',
    'Hauts-de-France'
  ],
  padel: [
    'padel Verberie',
    'terrain de padel Oise',
    'club padel',
    'réservation padel',
    'padel indoor',
    'padel outdoor',
    'tournoi padel',
    'leçon padel',
    'padel débutant',
    'padel confirmé',
    'double padel',
    'raquette padel',
    'padel 60410'
  ],
  fitness: [
    'salle de musculation',
    'fitness Verberie',
    'guidage machines',
    'renforcement musculaire',
    'préparation physique',
    'cardio',
    'haltérophilie loisir',
    'espace musculation',
    'entraînement libre',
    'coach sportif',
    'remise en forme',
    'perte de poids',
    'tonification'
  ],
  wellness: [
    'wellness Verberie',
    'bien-être sportif',
    'récupération',
    'relaxation',
    'soins corps',
    'espace détente',
    'centre wellness Oise',
    'rééquilibrage',
    'massage sportif',
    'sauna',
    'hammam'
  ],
  coursCollectifs: [
    'cours collectifs Verberie',
    'cycling',
    'HIIT',
    'renforcement',
    'stretching',
    'pilates',
    'yoga sportif',
    'body pump',
    'RPM',
    'cours fitness Oise'
  ],
  coaching: [
    'coach personnel Verberie',
    'programme personnalisé',
    'suivi sportif',
    'bilan forme',
    'objectifs performance',
    'nutrition sportive',
    'préparation compétition'
  ],
  blog: [
    'conseils fitness',
    'padel astuces',
    'bien-être sport',
    'actualités Espace Sport',
    'nutrition sportive',
    'récupération',
    'prévention blessures',
    'motivation sport'
  ],
  nutrition: [
    'nutrition sportive',
    'hydratation',
    'alimentation équilibrée',
    'repas avant effort',
    'récupération nutrition',
    'compléments alimentaires sport'
  ]
};

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  openGraph?: {
    title: string;
    description: string;
    images: string[];
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
  structuredData?: object;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const siteUrl = getSiteUrl();
  const siteName = `${SITE_BRAND_NAME} — Salle de sport, padel & wellness`;

  const defaultOgImage = `${siteUrl}/images/og-espace-sport.jpg`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    authors: [{ name: SITE_BRAND_NAME }],
    creator: SITE_BRAND_NAME,
    publisher: SITE_BRAND_NAME,

    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: config.canonicalUrl || siteUrl,
      siteName,
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      images:
        config.openGraph?.images?.length && config.openGraph.images.length > 0
          ? config.openGraph.images
          : [defaultOgImage],
    },

    twitter: {
      card: 'summary_large_image',
      title: config.twitter?.title || config.title,
      description: config.twitter?.description || config.description,
      images:
        config.twitter?.images?.length && config.twitter.images.length > 0
          ? config.twitter.images
          : [defaultOgImage],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },

    alternates: {
      canonical: config.canonicalUrl || siteUrl,
    },

    category: 'Sports & fitness',
  };
}

/** Location keywords — single site (Verberie), no subdomain. */
export function getLocationKeywords(): string[] {
  return ['Verberie', 'Oise', 'Hauts-de-France', 'France', '60410'];
}

/** JSON-LD for the Verberie club (gym, padel, wellness). */
export function generateLocalBusinessStructuredData() {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: SITE_BRAND_NAME,
    description:
      'Salle de sport, terrains de padel et espace wellness à Verberie (Oise) : musculation, cours collectifs, padel et accompagnement bien-être.',
    url: siteUrl,
    telephone: getContactPhone(),
    email: getContactEmail(),
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card',
    openingHours: ['Mo-Su 07:00-21:00'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Verberie',
      addressRegion: 'Oise',
      postalCode: '60410',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.3103,
      longitude: 2.7314,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Oise',
    },
  };
}
