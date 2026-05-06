'use client';

import React from 'react';
import { useUser } from '@frontend/lib/auth/client';
import { Alert, AlertDescription } from '@frontend/components/ui/alert';
import { Calendar, Clock, User, AlertCircle, Dumbbell } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

interface BookingFlowState {
  selectedService?: {
    name: string;
    description?: string;
    durationMins: number;
    picture?: string;
    priceCents: number;
  };
  selectedDate?: string;
  selectedTime?: string;
  selectedCoachId?: string;
  selectedStartTimeIso?: string;
  totalPrice?: number;
}

interface BookingSummaryProps {
  bookingState: BookingFlowState;
}

export function BookingSummary({ bookingState }: BookingSummaryProps) {
  const { user } = useUser();
  const { selectedService, selectedDate, selectedTime, selectedCoachId } = bookingState;

  const formatDateDisplay = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return "Aujourd'hui";
    if (isTomorrow(d)) return 'Demain';
    return format(d, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const formatPrice = (priceCents?: number) => {
    const amount = (priceCents || 0) / 100;
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  if (!selectedService || !selectedDate || !selectedTime || !selectedCoachId) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Alert className="max-w-sm border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            Informations de réservation incomplètes. Veuillez recommencer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-noka text-xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-2xl">
          Récapitulatif
        </h2>
        <p className="mt-1 text-sm text-black/40">
          Vérifiez les informations ci-dessous avant de confirmer.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Service card */}
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-black/10 bg-white">
          <div className="border-b border-black/8 px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">Service choisi</p>
          </div>
          <div className="flex gap-4 p-5">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-black/5">
              {selectedService.picture ? (
                <Image src={selectedService.picture} alt={selectedService.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-black/15" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-noka text-lg font-black uppercase tracking-tight text-[#1d1d1b] leading-tight">
                {selectedService.name}
              </p>
              {selectedService.description && (
                <p className="mt-1 text-xs leading-relaxed text-black/40 line-clamp-2">
                  {selectedService.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs text-black/35">{selectedService.durationMins} min</span>
                <span className="font-noka text-sm font-black text-[#1d1d1b]">
                  {formatPrice(selectedService.priceCents)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User card */}
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-black/10 bg-white">
          <div className="border-b border-black/8 px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">Vos informations</p>
          </div>
          <div className="p-5">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1d1d1b] text-sm font-bold text-white">
                  {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-[#1d1d1b]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-black/40">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-black/30">
                <User className="h-5 w-5" />
                <p className="text-sm">Connectez-vous pour pré-remplir vos informations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slot details */}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-black/10 bg-white">
        <div className="border-b border-black/8 px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">Créneau sélectionné</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-black/8 p-5">
          <div className="pr-5">
            <p className="flex items-center gap-1.5 text-xs text-black/35 mb-1">
              <Calendar className="h-3.5 w-3.5" />
              Date
            </p>
            <p className="font-semibold capitalize text-[#1d1d1b]">{formatDateDisplay(selectedDate)}</p>
          </div>
          <div className="pl-5">
            <p className="flex items-center gap-1.5 text-xs text-black/35 mb-1">
              <Clock className="h-3.5 w-3.5" />
              Heure
            </p>
            <p className="font-semibold text-[#1d1d1b]">{selectedTime}</p>
          </div>
        </div>
      </div>

      {/* Total + policy */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-black/30">
          Annulation gratuite jusqu&apos;à 24h avant la séance.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-black/40">Total :</span>
          <span className="font-noka text-2xl font-black text-[#1d1d1b]">
            {formatPrice(selectedService.priceCents)}
          </span>
        </div>
      </div>
    </div>
  );
}
