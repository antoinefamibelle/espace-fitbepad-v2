import { NextRequest, NextResponse } from 'next/server';
import { addDays, addHours, addMinutes, format, isBefore } from 'date-fns';

import { getPayloadClient, getCmsBaseUrl } from '@frontend/lib/server/payload';

interface Slot {
  time: string;
  available: boolean;
  coachIds: string[];
  startsAt: string;
}

interface OccupancyBooking {
  id: string;
  coachId: string;
  startTime: string;
  endTime: string;
}

function toDateAtTimeUtc(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hours, minutes, 0, 0),
  );
}

function toUtcDayStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

function toUtcDayEnd(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return startA < endB && endA > startB;
}

function getCoachId(coach: any): string {
  return typeof coach === 'string' ? coach : coach.id;
}

function normalizeCoachIds(input: any): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((value) => (typeof value === 'string' ? value : value?.id))
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
}

function resolveCoachWindowsForDay(coach: any, dayOfWeek: string, currentDay: Date) {
  const weeklyWindows = Array.isArray(coach.availability)
    ? coach.availability.filter((entry: any) => entry.dayOfWeek === dayOfWeek)
    : [];

  const exceptions = Array.isArray(coach.availabilityExceptions) ? coach.availabilityExceptions : [];
  const exception = exceptions.find((entry: any) => {
    if (!entry?.date) return false;
    const exceptionDate = new Date(entry.date);
    if (Number.isNaN(exceptionDate.getTime())) return false;
    return toUtcDateKey(exceptionDate) === toUtcDateKey(currentDay);
  });

  if (!exception) return weeklyWindows;
  if (exception.isAvailable === false) return [];
  if (exception.startTime && exception.endTime) {
    return [{ startTime: exception.startTime, endTime: exception.endTime }];
  }
  return weeklyWindows;
}

export async function GET(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.searchParams.get('serviceId');
    const coachId = request.nextUrl.searchParams.get('coachId');
    const startDateParam = request.nextUrl.searchParams.get('startDate');
    const days = Number(request.nextUrl.searchParams.get('days') || 15);

    if (!serviceId || !startDateParam) {
      return NextResponse.json({ success: false, error: 'Missing serviceId or startDate' }, { status: 400 });
    }

    const startDate = new Date(`${startDateParam}T00:00:00.000Z`);
    const now = new Date();

    const payload = await getPayloadClient();
    const service = await payload.findByID({
      collection: 'services',
      id: serviceId,
      depth: 1,
      overrideAccess: true,
    });

    const durationMinutes = Number(service.durationMinutes || 60);
    const minAdvanceBookingHours = Math.max(24, Number((service as any).minAdvanceBookingHours || 24));
    const maxAdvanceBookingDays = Math.max(1, Number((service as any).maxAdvanceBookingDays || 60));
    const bufferBeforeMinutes = Math.max(0, Number((service as any).bufferBeforeMinutes || 0));
    const bufferAfterMinutes = Math.max(0, Number((service as any).bufferAfterMinutes || 0));
    const earliestBookableAt = addHours(now, minAdvanceBookingHours);
    const latestBookableAt = addDays(now, maxAdvanceBookingDays);
    const requestedDays = Number.isFinite(days) ? Math.max(1, days) : 15;
    const effectiveDays = Math.min(requestedDays, maxAdvanceBookingDays);
    const endDate = addDays(startDate, effectiveDays - 1);

    const coachWhere: any = { isActive: { equals: true } };
    if (coachId) coachWhere.id = { equals: coachId };

    const coachesResponse = await payload.find({
      collection: 'coaches',
      limit: 100,
      depth: 1,
      overrideAccess: true,
      where: coachWhere,
    });

    const eligibleCoachIds = normalizeCoachIds((service as any).eligibleCoaches);
    const coaches = coachesResponse.docs.filter((coach: any) => {
      const currentCoachId = getCoachId(coach);
      if (!currentCoachId) return false;
      if (coachId && currentCoachId !== coachId) return false;
      if (eligibleCoachIds.length === 0) return true;
      return eligibleCoachIds.includes(currentCoachId);
    });

    if (coaches.length === 0) {
      return NextResponse.json({ success: true, availability: [] });
    }

    const coachIds = coaches.map((coach: any) => getCoachId(coach)).filter(Boolean).join(',');

    // The occupancy endpoint is a custom Payload endpoint — call it via HTTP since it requires
    // server-side booking conflict logic that isn't directly accessible via the Local API.
    const occupancyUrl = `${getCmsBaseUrl()}/api/availability/occupancy?startDate=${encodeURIComponent(toUtcDayStart(startDate).toISOString())}&endDate=${encodeURIComponent(toUtcDayEnd(endDate).toISOString())}&coachIds=${encodeURIComponent(coachIds)}`;
    const occupancyResponse = await fetch(occupancyUrl, {
      headers: {
        'x-payload-secret': process.env.PAYLOAD_SECRET || '',
      },
      cache: 'no-store',
    });
    const occupancyData = occupancyResponse.ok ? await occupancyResponse.json() : {};
    const bookings: OccupancyBooking[] = Array.isArray(occupancyData?.bookings) ? occupancyData.bookings : [];

    const availability = [];
    for (let dayOffset = 0; dayOffset < effectiveDays; dayOffset += 1) {
      const currentDay = addDays(startDate, dayOffset);
      const dayOfWeek = String(currentDay.getUTCDay());
      const slotsByTime = new Map<string, Slot>();

      for (const coach of coaches) {
        const coachAvailability = resolveCoachWindowsForDay(coach, dayOfWeek, currentDay);
        if (coachAvailability.length === 0) continue;

        const coachIdValue = getCoachId(coach);
        const coachBookings = bookings.filter((booking) => booking.coachId === coachIdValue);

        for (const window of coachAvailability) {
          const windowStart = toDateAtTimeUtc(currentDay, window.startTime);
          const windowEnd = toDateAtTimeUtc(currentDay, window.endTime);

          for (
            let slotStart = new Date(windowStart);
            isBefore(addMinutes(slotStart, durationMinutes), addMinutes(windowEnd, 1));
            slotStart = addMinutes(slotStart, 30)
          ) {
            const slotEnd = addMinutes(slotStart, durationMinutes);
            if (slotStart < earliestBookableAt || slotStart > latestBookableAt) continue;

            const slotStartWithBuffer = addMinutes(slotStart, -bufferBeforeMinutes);
            const slotEndWithBuffer = addMinutes(slotEnd, bufferAfterMinutes);
            const hasConflict = coachBookings.some((booking) => {
              const bookingStart = new Date(booking.startTime);
              const bookingEnd = new Date(booking.endTime);
              return overlaps(slotStartWithBuffer, slotEndWithBuffer, bookingStart, bookingEnd);
            });
            if (hasConflict) continue;

            const time = slotStart.toISOString().slice(11, 16);
            const slot = slotsByTime.get(time) || {
              time,
              available: true,
              coachIds: [],
              startsAt: slotStart.toISOString(),
            };
            slot.coachIds.push(coachIdValue);
            slotsByTime.set(time, slot);
          }
        }
      }

      availability.push({
        date: format(currentDay, 'yyyy-MM-dd'),
        availableSlots: [...slotsByTime.values()].sort((a, b) => a.time.localeCompare(b.time)),
      });
    }

    return NextResponse.json({ success: true, availability });
  } catch (error) {
    console.error('Failed to fetch availability', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}
