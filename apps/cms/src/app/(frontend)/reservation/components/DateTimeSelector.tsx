'use client';

import React, { useState } from 'react';
import { Calendar } from '@frontend/components/ui/calendar';
import { Alert, AlertDescription } from '@frontend/components/ui/alert';
import { Skeleton } from '@frontend/components/ui/skeleton';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@frontend/lib/utils';
import { format, isToday, isTomorrow, addDays, addHours, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBookingAvailability } from '@frontend/lib/hooks/use-booking-data';

interface Service {
  id: string;
  name: string;
  durationMins: number;
  priceCents: number;
  minAdvanceBookingHours?: number;
  maxAdvanceBookingDays?: number;
}

interface DateTimeSelectorProps {
  selectedService?: Service;
  selectedDate?: string;
  selectedTime?: string;
  onDateTimeSelect: (date: string, time: string, coachId?: string, startTimeIso?: string) => void;
}

interface AvailabilitySlot {
  time: string;
  available: boolean;
  coachIds: string[];
  startsAt?: string;
}

export function DateTimeSelector({
  selectedService,
  selectedDate,
  selectedTime,
  onDateTimeSelect,
}: DateTimeSelectorProps) {
  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );

  const minAdvanceBookingHours = Math.max(24, Number(selectedService?.minAdvanceBookingHours || 24));
  const maxAdvanceBookingDays = Math.max(1, Number(selectedService?.maxAdvanceBookingDays || 30));
  const minBookableDate = startOfDay(addHours(new Date(), minAdvanceBookingHours));
  const maxBookableDate = addDays(new Date(), maxAdvanceBookingDays);

  const { data: availability, isLoading: loadingAvailability, error: availabilityError } =
    useBookingAvailability({
      serviceId: selectedService?.id || '',
      startDate: selectedDate || format(new Date(), 'yyyy-MM-dd'),
      days: maxAdvanceBookingDays,
    });

  const selectedDateSlots = availability?.find(day => day.date === selectedDate)?.availableSlots as AvailabilitySlot[] | undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      setSelectedDateObj(date);
      onDateTimeSelect(dateString, '', undefined, undefined);
    }
  };

  const handleTimeSelect = (slot: AvailabilitySlot) => {
    if (selectedDate) {
      onDateTimeSelect(selectedDate, slot.time, slot.coachIds?.[0], slot.startsAt);
    }
  };

  const formatDateDisplay = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return "Aujourd'hui";
    if (isTomorrow(d)) return 'Demain';
    return format(d, 'EEEE d MMMM', { locale: fr });
  };

  const availableSlots = selectedDateSlots?.filter(s => s.available) ?? [];

  if (!selectedService) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Alert className="max-w-sm border-black/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Veuillez d&apos;abord sélectionner un service.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-noka text-xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-2xl">
          Choisissez votre créneau
        </h2>
        <p className="mt-1 text-sm text-black/40">
          Disponibilités du {format(minBookableDate, 'd MMM', { locale: fr })} au{' '}
          {format(maxBookableDate, 'd MMM yyyy', { locale: fr })}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Calendar */}
        <div className="rounded-[var(--radius-lg)] border border-black/10 bg-white">
          <div className="border-b border-black/8 px-5 py-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-black/40">
              <CalendarIcon className="h-3.5 w-3.5" />
              Choisir une date
            </h3>
          </div>
          <div className="flex justify-center p-4">
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={handleDateSelect}
              disabled={(date) => date < minBookableDate || date > maxBookableDate}
              locale={fr}
              className="rounded-md text-[#1d1d1b]"
              classNames={{
                nav_button: 'h-7 w-7 border border-black/10 bg-white text-[#1d1d1b] hover:bg-black/5 p-0 opacity-100',
                day_selected: 'bg-[#1d1d1b] text-white hover:bg-black hover:text-white focus:bg-[#1d1d1b] focus:text-white',
                day_today: 'border border-[#52ad77] text-[#1d1d1b] font-semibold',
                day_disabled: 'opacity-25',
              }}
            />
          </div>
        </div>

        {/* Time slots */}
        <div className="rounded-[var(--radius-lg)] border border-black/10 bg-white">
          <div className="border-b border-black/8 px-5 py-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-black/40">
              <Clock className="h-3.5 w-3.5" />
              {selectedDate ? (
                <span className="capitalize text-[#1d1d1b]">{formatDateDisplay(selectedDate)}</span>
              ) : (
                'Choisir un créneau'
              )}
            </h3>
          </div>

          <div className="p-4">
            {!selectedDate ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 text-center">
                <CalendarIcon className="h-7 w-7 text-black/15" />
                <p className="text-sm text-black/30">Sélectionnez d&apos;abord une date.</p>
              </div>
            ) : loadingAvailability ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 rounded-[var(--radius-md)]" />
                ))}
              </div>
            ) : availabilityError ? (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  Impossible de charger les créneaux. Réessayez.
                </AlertDescription>
              </Alert>
            ) : availableSlots.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 text-center">
                <Clock className="h-7 w-7 text-black/15" />
                <p className="text-sm text-black/30">Aucun créneau disponible pour cette date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => handleTimeSelect(slot)}
                      className={cn(
                        'rounded-[var(--radius-md)] border py-3 text-sm font-semibold transition-colors cursor-pointer',
                        isSelected
                          ? 'border-[#1d1d1b] bg-[#1d1d1b] text-white'
                          : 'border-black/10 bg-white text-[#1d1d1b] hover:border-black/25 hover:bg-black/4'
                      )}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection confirmation */}
      {selectedDate && selectedTime && (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[#52ad77]/30 bg-[#52ad77]/8 px-4 py-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#52ad77]">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#1d1d1b]">
            <span className="capitalize">{formatDateDisplay(selectedDate)}</span> à <strong>{selectedTime}</strong> — Prêt à continuer
          </p>
        </div>
      )}
    </div>
  );
}
