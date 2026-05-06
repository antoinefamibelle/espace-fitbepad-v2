import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import moment from 'moment';

const fetchAvailability = async ({
  centerSlug,
  treatmentId,
  date,
}: {
  centerSlug: string;
  treatmentId: string;
  date: string;
}) => {
  const response = await api.get(
    `/centers/${centerSlug}/availibility?treatmentId=${treatmentId}&startDate=${date}&days=1`,
  );

  // Get the available slots from the response
  const availableSlots = response.data[0]?.availableSlots || [];

  // Create 30-minute interval slots
  const slots: { startTime: string; endTime: string }[] = [];

  availableSlots.forEach((slot: string) => {
    // Add the original slot
    slots.push({
      startTime: slot,
      endTime: moment(slot, 'HH:mm').add(1, 'hour').format('HH:mm'),
    });

    // Add a slot starting 30 minutes later
    const halfHourSlot = moment(slot, 'HH:mm')
      .add(30, 'minutes')
      .format('HH:mm');
    if (availableSlots.includes(halfHourSlot)) {
      slots.push({
        startTime: halfHourSlot,
        endTime: moment(halfHourSlot, 'HH:mm').add(1, 'hour').format('HH:mm'),
      });
    }
  });

  // Sort slots by start time
  return slots.sort((a, b) =>
    moment(a.startTime, 'HH:mm').diff(moment(b.startTime, 'HH:mm')),
  );
};

export function useAvailability({
  centerSlug,
  treatmentId,
  date,
}: {
  centerSlug: string;
  treatmentId: string;
  date: string;
}) {
  return useQuery({
    queryKey: ['availability', centerSlug, treatmentId, date],
    queryFn: () => fetchAvailability({ centerSlug, treatmentId, date }),
    enabled: !!centerSlug && !!treatmentId && !!date,
  });
}
