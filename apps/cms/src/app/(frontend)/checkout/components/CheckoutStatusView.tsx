'use client';

import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Loader2 as Spinner,
  CheckCircle2,
  Calendar,
  Clock,
  Tag,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  Dumbbell,
  type LucideIcon,
} from 'lucide-react';
import type { BookingResponseWithDetails } from 'shared';

interface CheckoutSessionResponse {
  url: string;
}

interface BookingByIdResponse {
  success: boolean;
  booking: BookingResponseWithDetails;
}

type ViewContext = 'default' | 'success' | 'cancel';

interface CheckoutStatusViewProps {
  bookingId: string | null;
  context: ViewContext;
}

function formatBookingDate(booking: BookingResponseWithDetails): string {
  try {
    const raw = booking.date ?? booking.startTime;
    if (!raw) return '—';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(raw);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function formatBookingTime(startTime: string | undefined | null): string {
  if (!startTime) return '—';
  try {
    const d = new Date(startTime);
    if (isNaN(d.getTime())) return String(startTime);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(startTime);
  }
}

function formatAmount(totalCents: number | null | undefined): string {
  return ((totalCents ?? 0) / 100).toFixed(2);
}

// ─── Skeleton loading ──────────────────────────────────────────────────────

function LoadingView({ context }: { context: ViewContext }) {
  const isSuccess = context === 'success';
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 gap-6">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${
          isSuccess
            ? 'border-luxury-green/30 bg-luxury-green/8'
            : 'border-amber-200 bg-amber-50'
        }`}
      >
        <Spinner
          className={`w-8 h-8 animate-spin ${isSuccess ? 'text-luxury-green' : 'text-amber-600'}`}
        />
      </div>
      <p className="text-luxury-black/50 text-base tracking-wide">
        {isSuccess ? 'Vérification de votre paiement…' : 'Chargement de votre réservation…'}
      </p>
    </div>
  );
}

// ─── Error / missing ID ────────────────────────────────────────────────────

function ErrorView({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
        <AlertTriangle className="w-9 h-9 text-red-600" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-luxury-black font-poppins mb-2">
          Une erreur est survenue
        </h1>
        <p className="text-luxury-black/50 max-w-xs mx-auto">{message}</p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-luxury-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-luxury-black/90 transition-colors cursor-pointer"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

// ─── Booking detail row ────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: 'green' | 'amber';
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          accent === 'green' ? 'bg-luxury-green/10' : 'bg-amber-50'
        }`}
      >
        <Icon
          className={`w-4 h-4 ${accent === 'green' ? 'text-luxury-green' : 'text-amber-600'}`}
          strokeWidth={1.75}
        />
      </div>
      <div className="min-w-0">
        <p className="text-luxury-black/40 text-xs uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-luxury-black font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Success confirmed ─────────────────────────────────────────────────────

function SuccessConfirmedView({
  booking,
  isConfirming = false,
}: {
  booking: BookingResponseWithDetails;
  isConfirming?: boolean;
}) {
  const formattedDate = formatBookingDate(booking);
  const formattedTime = formatBookingTime(booking.startTime);
  const amount = formatAmount(booking.totalCents);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      {/* Hero checkmark */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-luxury-green/10 border-2 border-luxury-green/40 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-luxury-green" strokeWidth={1.25} />
          </div>
        </div>
        <span className="text-[#2a7a4a] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          Paiement confirmé
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-luxury-black font-poppins leading-tight mb-4">
          Votre séance est<br />réservée&nbsp;!
        </h1>
        <p className="text-luxury-black/55 text-base max-w-xs">
          Préparez-vous. Votre prochain défi vous attend.
        </p>
      </div>

      {/* Booking card */}
      <div className="w-full max-w-md bg-[#f7f7f5] rounded-2xl p-8 mb-8">
        <div className="space-y-5">
          <DetailRow icon={Dumbbell} label="Service" value={booking.service?.name ?? '—'} accent="green" />
          <DetailRow icon={Calendar} label="Date" value={formattedDate} accent="green" />
          <DetailRow icon={Clock} label="Heure" value={formattedTime} accent="green" />

          <div className="h-px bg-luxury-black/8" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-luxury-green/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-luxury-green" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-luxury-black/40 text-xs uppercase tracking-widest mb-0.5">
                  Montant payé
                </p>
                <p className="text-luxury-black font-semibold">{amount}&nbsp;€</p>
              </div>
            </div>
            {isConfirming ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200">
                <Spinner className="w-3 h-3 animate-spin" />
                En cours…
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#2a7a4a] bg-luxury-green/10 px-3 py-1.5 rounded-full border border-luxury-green/20">
                Confirmé
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Link
          href="/profile"
          className="flex-1 text-center bg-luxury-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-luxury-black/90 transition-colors cursor-pointer"
        >
          Mes réservations
        </Link>
        <Link
          href="/"
          className="flex-1 text-center border border-luxury-black/15 text-luxury-black px-6 py-4 rounded-xl font-medium hover:bg-luxury-black/5 transition-colors cursor-pointer"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

// ─── Cancel / pending payment ──────────────────────────────────────────────

function CancelView({
  booking,
  retryLabel,
  onRetry,
  isRetrying,
}: {
  booking: BookingResponseWithDetails;
  retryLabel: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const formattedDate = formatBookingDate(booking);
  const formattedTime = formatBookingTime(booking.startTime);
  const amount = formatAmount(booking.totalCents);
  const canRetry =
    booking.status === 'pending_payment' ||
    booking.status === 'failed_payment' ||
    booking.paymentStatus === 'expired';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      {/* Hero header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-8">
          <CreditCard className="w-11 h-11 text-amber-600" strokeWidth={1.25} />
        </div>
        <span className="text-amber-800 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          Paiement requis
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-luxury-black font-poppins leading-tight mb-4">
          Ne manquez pas<br />votre séance
        </h1>
        <p className="text-luxury-black/55 text-base max-w-sm">
          Votre place est réservée. Finalisez le paiement avant qu&apos;elle ne soit libérée.
        </p>
      </div>

      {/* Booking card */}
      <div className="w-full max-w-md bg-[#f7f7f5] rounded-2xl p-8 mb-6">
        <p className="text-luxury-black/35 text-xs uppercase tracking-widest mb-5">
          Votre réservation
        </p>
        <div className="space-y-5">
          <DetailRow icon={Dumbbell} label="Service" value={booking.service?.name ?? '—'} accent="amber" />
          <DetailRow icon={Calendar} label="Date" value={formattedDate} accent="amber" />
          <DetailRow icon={Clock} label="Heure" value={formattedTime} accent="amber" />

          <div className="h-px bg-luxury-black/8" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-black/40 text-xs uppercase tracking-widest mb-1">Montant</p>
              <p className="text-luxury-black text-2xl font-bold">{amount}&nbsp;€</p>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200">
              En attente
            </span>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      {canRetry && (
        <button
          className="w-full max-w-md flex items-center justify-center gap-3 bg-luxury-black text-white px-8 py-5 rounded-xl text-lg font-bold hover:bg-luxury-black/90 transition-colors cursor-pointer mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? <Spinner className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
          {retryLabel}
        </button>
      )}

      <Link
        href="/"
        className="text-luxury-black/35 text-sm hover:text-luxury-black/60 transition-colors cursor-pointer"
      >
        Revenir à l&apos;accueil
      </Link>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

export function CheckoutStatusView({ bookingId, context }: CheckoutStatusViewProps) {
  const normalizedBookingId = bookingId ?? '';
  const refetchInterval = context === 'default' ? false : 3000;

  const retryLabel = useMemo(
    () => (context === 'cancel' ? 'Reprendre le paiement' : 'Compléter le paiement'),
    [context],
  );

  const fetchBookingDetails = async (id: string): Promise<BookingResponseWithDetails> => {
    const { data } = await axios.get<BookingByIdResponse>(`/api/bookings/${id}`);
    return data.booking;
  };

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useQuery<BookingResponseWithDetails, AxiosError>({
    queryKey: ['bookingDetails', normalizedBookingId],
    queryFn: () => fetchBookingDetails(normalizedBookingId),
    enabled: Boolean(normalizedBookingId),
    refetchInterval,
  });

  const retryPaymentMutationFn = async (id: string): Promise<CheckoutSessionResponse> => {
    const { data } = await axios.post(`/api/bookings/${id}/checkout`);
    return data;
  };

  const { mutate: handleRetryPayment, isPending: isRetryingPayment } =
    useMutation<CheckoutSessionResponse, AxiosError, string>({
      mutationFn: retryPaymentMutationFn,
      onSuccess: (data) => {
        if (data.url) {
          toast.success('Redirection vers la page de paiement…');
          window.location.href = data.url;
          return;
        }
        toast.error('URL de paiement non reçue. Veuillez réessayer.');
      },
      onError: (mutationError) => {
        const axiosError = mutationError as AxiosError<{ error?: string }>;
        const msg = axiosError.response?.data?.error ?? 'Une erreur est survenue.';
        toast.error(`Impossible de relancer le paiement : ${msg}`);
      },
    });

  if (!bookingId) {
    return <ErrorView message="L'identifiant de réservation est manquant dans l'URL." />;
  }

  if (isLoading) {
    return <LoadingView context={context} />;
  }

  if (isError || !booking) {
    const axiosError = error as AxiosError<{ error?: string }> | null;
    const msg = axiosError?.response?.data?.error ?? axiosError?.message ?? 'Erreur inconnue';
    return <ErrorView message={`Impossible de récupérer la réservation : ${msg}`} />;
  }

  if (context === 'success') {
    // Stripe only redirects to success_url when payment is accepted, so always
    // show the success view. If the webhook hasn't processed yet the status will
    // still be 'pending_payment' — surface that as a subtle badge while polling.
    return (
      <SuccessConfirmedView
        booking={booking}
        isConfirming={booking.status !== 'confirmed'}
      />
    );
  }

  return (
    <CancelView
      booking={booking}
      retryLabel={retryLabel}
      onRetry={() => handleRetryPayment(booking.id)}
      isRetrying={isRetryingPayment}
    />
  );
}
