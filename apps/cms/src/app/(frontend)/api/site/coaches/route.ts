import { NextResponse } from 'next/server';

import { getPayloadClient } from '@frontend/lib/server/payload';
import { payloadMediaUrl } from '@frontend/lib/server/payload-media';

const coachCategories = ['fitness', 'padel', 'wellness'] as const;
type CoachCategory = (typeof coachCategories)[number];

const gradientMap: Record<string, string> = {
  violet_rose: 'from-purple-500 to-pink-500',
  vert_emeraude: 'from-green-500 to-emerald-500',
  bleu_cyan: 'from-blue-500 to-cyan-500',
};

function mapCoach(doc: any) {
  return {
    id: String(doc.slug || doc.id),
    name: doc.displayName || '',
    title: doc.title || '',
    specialties: Array.isArray(doc.specialties) ? doc.specialties.map((item: any) => item?.value).filter(Boolean) : [],
    bio: doc.marketingBio || '',
    image: payloadMediaUrl(doc.profilePicture, '/images/coach/coach-1.jpg'),
    certifications: Array.isArray(doc.certifications) ? doc.certifications.map((item: any) => item?.name).filter(Boolean) : [],
    experience: doc.experience || '',
    quote: doc.quote || '',
    gradient: gradientMap[doc.cardGradient] || gradientMap.violet_rose,
    category: coachCategories.includes(doc.category) ? doc.category : 'fitness',
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');

    if (categoryParam && !coachCategories.includes(categoryParam as CoachCategory)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category. Expected one of: fitness, padel, wellness.' },
        { status: 400 },
      );
    }

    const where: any = { isActive: { equals: true } };
    if (categoryParam) {
      where.category = { equals: categoryParam };
    }

    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'coaches',
      depth: 1,
      sort: 'sortOrder',
      where,
      overrideAccess: true,
    });

    const coaches = docs.map(mapCoach);
    return NextResponse.json({ success: true, coaches });
  } catch (error) {
    console.error('Failed to fetch site coaches', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch site coaches' }, { status: 500 });
  }
}
