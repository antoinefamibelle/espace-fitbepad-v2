import { payloadMediaUrl } from '@frontend/lib/server/payload-media';

function mapEligibleCoachIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((coach) => (typeof coach === 'string' ? coach : (coach as { id?: unknown })?.id))
    .filter((id): id is string => typeof id === 'string');
}

export function mapService(doc: any) {
  const picture = payloadMediaUrl(doc.image, '') || undefined;

  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.shortDescription || '',
    priceCents: doc.priceCents,
    durationMins: doc.durationMinutes,
    picture,
    minAdvanceBookingHours: Number(doc.minAdvanceBookingHours || 24),
    maxAdvanceBookingDays: Number(doc.maxAdvanceBookingDays || 60),
    eligibleCoachIds: mapEligibleCoachIds(doc.eligibleCoaches),
    isActive: Boolean(doc.isActive),
  };
}
