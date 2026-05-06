'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@frontend/lib/auth/client';
import { toast } from 'sonner';
import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calendar,
  User,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  Clock,
  CreditCard,
  Check,
} from 'lucide-react';
import { cn } from '@frontend/lib/utils';
import { ServiceSelector } from './components/ServiceSelector';
import { DateTimeSelector } from './components/DateTimeSelector';
import { AuthenticationStep } from './components/AuthenticationStep';
import { BookingSummary } from './components/BookingSummary';
import { useCreateBooking } from '@frontend/lib/hooks/use-booking-data';

export type BookingStep = 'service' | 'datetime' | 'auth' | 'summary';

interface BookingService {
  id: string;
  name: string;
  slug?: string;
  priceCents: number;
  durationMins: number;
  description?: string;
  picture?: string;
  isActive?: boolean;
  minAdvanceBookingHours?: number;
  maxAdvanceBookingDays?: number;
}

export interface BookingFlowState {
  step: BookingStep;
  selectedService?: BookingService;
  selectedDate?: string;
  selectedTime?: string;
  selectedCoachId?: string;
  selectedStartTimeIso?: string;
  totalPrice?: number;
}

const steps = [
  { id: 'service', label: 'Service', icon: CheckCircle },
  { id: 'datetime', label: 'Date & Heure', icon: Calendar },
  { id: 'auth', label: 'Connexion', icon: User },
  { id: 'summary', label: 'Récapitulatif', icon: CheckCircle },
];
const stepOrder: BookingStep[] = ['service', 'datetime', 'auth', 'summary'];

export default function ReservationPage() {
  const { user, isLoaded } = useUser();
  const { mutateAsync: createBookingMutation, isPending: isCreatingBooking } = useCreateBooking();
  const [bookingState, setBookingState] = useState<BookingFlowState>({ step: 'service' });

  const currentStepIndex = steps.findIndex(s => s.id === bookingState.step);

  const updateBookingState = (updates: Partial<BookingFlowState>) =>
    setBookingState(prev => ({ ...prev, ...updates }));

  const formatDateDisplay = (date?: string) => {
    if (!date) return '—';
    const d = new Date(date);
    if (isToday(d)) return "Aujourd'hui";
    if (isTomorrow(d)) return 'Demain';
    return format(d, 'EEEE d MMM', { locale: fr });
  };

  const goToNextStep = async () => {
    const currentIndex = stepOrder.indexOf(bookingState.step);

    if (bookingState.step === 'summary') {
      if (!bookingState.selectedService || !bookingState.selectedDate || !bookingState.selectedTime || !bookingState.selectedCoachId) {
        toast.error('Informations de réservation manquantes');
        return;
      }
      const booking = await createBookingMutation({
        date: bookingState.selectedDate,
        startTime: bookingState.selectedTime,
        startTimeIso: bookingState.selectedStartTimeIso,
        serviceId: bookingState.selectedService.id,
        coachId: bookingState.selectedCoachId,
        couponCode: undefined,
        appliedCoupon: undefined,
      } as Parameters<typeof createBookingMutation>[0]);
      window.location.href = `/checkout?booking_id=${booking.id}`;
      return;
    }

    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      if (nextStep === 'auth' && user) {
        updateBookingState({ step: 'summary' });
      } else {
        updateBookingState({ step: nextStep });
      }
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = stepOrder.indexOf(bookingState.step);
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1];
      if (prevStep === 'auth' && user && bookingState.step === 'summary') {
        updateBookingState({ step: 'datetime' });
      } else {
        updateBookingState({ step: prevStep });
      }
    }
  };

  const renderStepContent = () => {
    switch (bookingState.step) {
      case 'service':
        return (
          <ServiceSelector
            selectedService={bookingState.selectedService}
            onServiceSelect={(service) =>
              updateBookingState({ selectedService: service, totalPrice: service.priceCents / 100 })
            }
          />
        );
      case 'datetime':
        return (
          <DateTimeSelector
            selectedService={bookingState.selectedService}
            selectedDate={bookingState.selectedDate}
            selectedTime={bookingState.selectedTime}
            onDateTimeSelect={(date, time, coachId, startTimeIso) =>
              updateBookingState({ selectedDate: date, selectedTime: time, selectedCoachId: coachId, selectedStartTimeIso: startTimeIso })
            }
          />
        );
      case 'auth':
        return <AuthenticationStep />;
      case 'summary':
        return <BookingSummary bookingState={bookingState} />;
      default:
        return null;
    }
  };

  const canGoNext =
    (bookingState.step === 'service' && !!bookingState.selectedService) ||
    (bookingState.step === 'datetime' && !!bookingState.selectedDate && !!bookingState.selectedTime && !!bookingState.selectedCoachId) ||
    (bookingState.step === 'auth' && !!user) ||
    bookingState.step === 'summary';

  const ctaLabel = bookingState.step === 'summary' ? 'Réserver et payer' : 'Continuer';

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#1d1d1b]" />
          <p className="text-sm text-black/40">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="border-b border-black/8 px-4 py-5 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/30">
                Réservation
              </p>
              <h1 className="font-noka text-xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-2xl">
                Réserve ta séance
              </h1>
            </div>
            <span className="text-xs font-semibold text-black/30">
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>

          {/* Step strip */}
          <div className="mt-4 flex items-center overflow-x-auto pb-1">
            {steps.map((step, index) => {
              const isActive = step.id === bookingState.step;
              const isCompleted = index < currentStepIndex;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    <span
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors',
                        isCompleted ? 'bg-[#52ad77] text-white' :
                        isActive ? 'bg-[#1d1d1b] text-white' :
                        'bg-black/8 text-black/25'
                      )}
                    >
                      {isCompleted ? <Check className="h-2.5 w-2.5" /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        'whitespace-nowrap text-[10px] font-bold uppercase tracking-wide transition-colors',
                        isActive ? 'text-[#1d1d1b]' :
                        isCompleted ? 'text-[#52ad77]' :
                        'text-black/25'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'mx-2 h-px w-6 flex-shrink-0 transition-colors',
                      isCompleted ? 'bg-[#52ad77]' : 'bg-black/10'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-0.5 w-full bg-black/8">
            <motion.div
              className="h-full bg-[#1d1d1b]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">

          {/* Step content */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={bookingState.step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Summary sidebar — desktop only */}
          <aside className="hidden w-64 flex-shrink-0 lg:block xl:w-72">
            <div className="sticky top-6 rounded-[var(--radius-lg)] border border-black/10 bg-white p-5">
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">
                Résumé
              </h3>
              <div className="space-y-2">
                <SummaryRow
                  label="Service"
                  value={bookingState.selectedService?.name}
                  placeholder="Non sélectionné"
                />
                <SummaryRow
                  label="Date"
                  value={bookingState.selectedDate ? formatDateDisplay(bookingState.selectedDate) : undefined}
                  placeholder="À définir"
                  icon={<Calendar className="h-3.5 w-3.5" />}
                />
                <SummaryRow
                  label="Heure"
                  value={bookingState.selectedTime}
                  placeholder="À définir"
                  icon={<Clock className="h-3.5 w-3.5" />}
                />
                <div className="mt-3 border-t border-black/8 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-black/40">
                      <CreditCard className="h-3.5 w-3.5" />
                      Total
                    </span>
                    <span className="font-noka text-xl font-black text-[#1d1d1b]">
                      {(bookingState.totalPrice || 0).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile summary strip — above CTA */}
      {(bookingState.selectedService || bookingState.selectedDate) && (
        <div className="border-t border-black/8 px-4 py-2 lg:hidden">
          <div className="flex items-center justify-between text-xs text-black/40">
            <span className="truncate">
              {[
                bookingState.selectedService?.name,
                bookingState.selectedDate ? formatDateDisplay(bookingState.selectedDate) : null,
                bookingState.selectedTime,
              ].filter(Boolean).join(' · ')}
            </span>
            {bookingState.totalPrice ? (
              <span className="ml-3 flex-shrink-0 font-noka text-sm font-black text-[#1d1d1b]">
                {bookingState.totalPrice.toFixed(2)}€
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Sticky bottom nav */}
      <div className="sticky bottom-0 z-20 border-t border-black/8 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          {bookingState.step === 'service' ? (
            <div />
          ) : (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="flex items-center gap-1.5 text-sm font-semibold text-black/40 transition-colors hover:text-[#1d1d1b] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Précédent</span>
            </button>
          )}

          <button
            type="button"
            onClick={goToNextStep}
            disabled={!canGoNext || isCreatingBooking}
            className={cn(
              'flex items-center gap-2 rounded-[var(--radius-md)] px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer',
              canGoNext && !isCreatingBooking
                ? 'bg-[#1d1d1b] text-white hover:bg-black'
                : 'bg-black/8 text-black/25 cursor-not-allowed'
            )}
          >
            {isCreatingBooking ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Création...
              </>
            ) : (
              <>
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  placeholder,
  icon,
}: {
  label: string;
  value?: string;
  placeholder: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="flex items-center gap-1.5 text-xs text-black/35">
        {icon}
        {label}
      </span>
      <span className={cn('text-right text-xs font-medium', value ? 'text-[#1d1d1b]' : 'text-black/20')}>
        {value || placeholder}
      </span>
    </div>
  );
}
