import { NextResponse } from 'next/server';

import { getPayloadClient } from '@frontend/lib/server/payload';

function mapSubscription(doc: any) {
  return {
    id: String(doc.slug || doc.id),
    title: doc.title || '',
    subtitle: doc.subtitle || '',
    price: Number(doc.price || 0),
    period: doc.period || 'mois',
    registrationFee: Number(doc.registrationFee || 0),
    isPopular: Boolean(doc.isPopular),
    isPremium: Boolean(doc.isPremium),
    benefits: Array.isArray(doc.benefits) ? doc.benefits.map((item: any) => item?.value).filter(Boolean) : [],
    description: doc.description || '',
    gradient: doc.gradient || 'from-luxury-black to-luxury-black',
    icon: doc.icon || '⭐',
    ctaText: doc.ctaText || 'Souscrire',
    restrictions: Array.isArray(doc.restrictions) ? doc.restrictions.map((item: any) => item?.value).filter(Boolean) : [],
  };
}

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'subscriptions',
      depth: 1,
      sort: 'sortOrder',
      where: { isActive: { equals: true } },
      overrideAccess: true,
    });

    const subscriptions = docs.map(mapSubscription);
    return NextResponse.json({ success: true, subscriptions });
  } catch (error) {
    console.error('Failed to fetch site subscriptions', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch site subscriptions' }, { status: 500 });
  }
}
