import { addMinutes, areIntervalsOverlapping } from 'date-fns';

export interface TimeSlot {
  start: Date;
  end: Date;
}

export function buildSlot(date: Date, startTime: string, durationMinutes: number): TimeSlot {
  const [hours, minutes] = startTime.split(':').map(Number);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);
  return { start, end: addMinutes(start, durationMinutes) };
}

export function hasConflict(slot: TimeSlot, existing: TimeSlot[]): boolean {
  return existing.some((s) =>
    areIntervalsOverlapping(
      { start: slot.start, end: slot.end },
      { start: s.start, end: s.end },
      { inclusive: false },
    ),
  );
}
