import 'server-only';

type PayloadEntity = { id: string; [key: string]: any } | string | null | undefined;

function relationId(value: PayloadEntity): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.id ?? null;
}

function relationObject<T extends Record<string, any>>(value: PayloadEntity): T | null {
  if (!value || typeof value === 'string') return null;
  return value as unknown as T;
}

export function toBookingDateStart(startTime: string | Date) {
  const date = new Date(startTime);
  return {
    date: date.toISOString().slice(0, 10),
    startTime: date.toISOString().slice(11, 16),
  };
}

export function mapPayloadBooking(doc: any) {
  const { date, startTime } = toBookingDateStart(doc.startTime);
  const service = relationObject<any>(doc.service);
  const coach = relationObject<any>(doc.coach);
  const user = relationObject<any>(doc.user);

  return {
    id: doc.id,
    userId: relationId(doc.user),
    serviceId: relationId(doc.service),
    coachId: relationId(doc.coach),
    date,
    startTime,
    timezone: doc.timezone || 'UTC',
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    couponId: relationId(doc.coupon),
    priceCents: doc.priceCents,
    discountCents: doc.discountCents,
    discountAmountCents: doc.discountCents ?? 0,
    totalCents: doc.totalCents,
    currency: doc.currency,
    customerNotes: doc.customerNotes || '',
    service: service
      ? {
          id: service.id,
          name: service.name,
          description: service.shortDescription || service.description || '',
          priceCents: service.priceCents,
          durationMins: service.durationMinutes,
        }
      : undefined,
    coach: coach
      ? {
          id: coach.id,
          name: coach.displayName,
          email: coach.email,
          phone: coach.phone || '',
        }
      : undefined,
    user: user
      ? {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      : undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
