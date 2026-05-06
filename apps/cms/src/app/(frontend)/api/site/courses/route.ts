import { NextResponse } from 'next/server';

import { getPayloadClient } from '@frontend/lib/server/payload';
import { payloadMediaUrl } from '@frontend/lib/server/payload-media';

const categoryLabelMap: Record<string, string> = {
  fitness: 'Fitness',
  bien_etre: 'Bien-être',
  padel: 'Padel',
  force: 'Force',
};

const difficultyLabelMap: Record<string, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
};

function mapCourse(doc: any) {
  return {
    id: String(doc.slug || doc.id),
    title: doc.title || '',
    category: categoryLabelMap[doc.category] || doc.category || '',
    description: doc.description || '',
    duration: doc.duration || '',
    difficulty: difficultyLabelMap[doc.difficulty] || doc.difficulty || '',
    maxParticipants: Number(doc.maxParticipants || 0),
    image: payloadMediaUrl(doc.image),
    benefits: Array.isArray(doc.benefits) ? doc.benefits.map((item: any) => item?.value).filter(Boolean) : [],
    equipment: Array.isArray(doc.equipment) ? doc.equipment.map((item: any) => item?.value).filter(Boolean) : [],
    price: Number(doc.price || 0),
    gradient: doc.gradient || 'from-gray-400 to-gray-500',
  };
}

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'courses',
      depth: 1,
      sort: 'sortOrder',
      where: { isActive: { equals: true } },
      overrideAccess: true,
    });

    const courses = docs.map(mapCourse);
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Failed to fetch site courses', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch site courses' }, { status: 500 });
  }
}
