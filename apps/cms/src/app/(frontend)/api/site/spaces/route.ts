import { NextResponse } from 'next/server';

import { getPayloadClient } from '@frontend/lib/server/payload';
import { payloadMediaUrl } from '@frontend/lib/server/payload-media';

const categoryLabelMap: Record<string, string> = {
  musculation_cardio: 'Musculation & Cardio',
  sport_raquette: 'Sport de raquette',
  relaxation_recovery: 'Relaxation & Recovery',
  training_specialise: 'Training spécialisé',
  relaxation: 'Relaxation',
};

function mapSpace(doc: any) {
  return {
    id: String(doc.slug || doc.id),
    name: doc.name || '',
    category: categoryLabelMap[doc.category] || doc.category || '',
    description: doc.description || '',
    features: Array.isArray(doc.features) ? doc.features.map((item: any) => item?.value).filter(Boolean) : [],
    equipment: Array.isArray(doc.equipment) ? doc.equipment.map((item: any) => item?.value).filter(Boolean) : [],
    capacity: doc.capacity || '',
    hours: doc.hours || '',
    image: payloadMediaUrl(doc.image),
    gallery: Array.isArray(doc.gallery) ? doc.gallery.map((item: any) => payloadMediaUrl(item)).filter(Boolean) : [],
    amenities: Array.isArray(doc.amenities) ? doc.amenities.map((item: any) => item?.value).filter(Boolean) : [],
    specifications: {
      surface: doc.specifications?.surface || '',
      temperature: doc.specifications?.temperature || '',
      ventilation: doc.specifications?.ventilation || '',
      sound: doc.specifications?.sound || '',
    },
    gradient: doc.gradient || 'from-gray-400 to-gray-500',
  };
}

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'spaces',
      depth: 1,
      sort: 'sortOrder',
      where: { isActive: { equals: true } },
      overrideAccess: true,
    });

    const spaces = docs.map(mapSpace);
    return NextResponse.json({ success: true, spaces });
  } catch (error) {
    console.error('Failed to fetch site spaces', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch site spaces' }, { status: 500 });
  }
}
