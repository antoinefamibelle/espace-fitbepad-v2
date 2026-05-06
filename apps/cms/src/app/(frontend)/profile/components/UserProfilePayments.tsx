'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { internalApi } from '@frontend/lib/api';
import { useUserBookings } from '@frontend/lib/hooks/use-user-bookings';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Skeleton } from '@frontend/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@frontend/components/ui/dialog';
import { CreditCard, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import type { BookingResponseWithDetails } from 'shared';
import { toast } from 'sonner';

interface PaymentRetryResponse {
  paymentUrl: string;
}

type PaymentFilter = 'all' | 'due' | 'paid';

function formatAmount(
  cents?: number | null,
  currency?: string | null,
): string | null {
  if (!cents || cents <= 0) return null;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: (currency || 'EUR').toUpperCase(),
  }).format(cents / 100);
}

function isPaymentDue(booking: BookingResponseWithDetails): boolean {
  return (
    booking.status === 'pending_payment' ||
    booking.status === 'failed_payment' ||
    booking.paymentStatus === 'unpaid' ||
    booking.paymentStatus === 'failed'
  );
}

function isPaymentPaid(booking: BookingResponseWithDetails): boolean {
  return (
    booking.paymentStatus === 'paid' ||
    booking.status === 'completed'
  );
}

export function UserProfilePayments() {
  const { data: bookings, isLoading, error } = useUserBookings({ limit: 30, offset: 0 });
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('all');
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const retryPaymentMutation = useMutation({
    mutationFn: async (bookingId: string) =>
      (await internalApi.post<PaymentRetryResponse>(`/api/bookings/${bookingId}/retry-payment`, {}))
        .data,
    onSuccess: data => {
      setPaymentLink(data.paymentUrl);
      toast.success('Lien de paiement genere avec succes.');
    },
    onError: () => {
      toast.error('Impossible de generer un lien de paiement.');
    },
  });

  const paymentBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter(booking => {
      if (activeFilter === 'due') return isPaymentDue(booking);
      if (activeFilter === 'paid') return isPaymentPaid(booking);
      return true;
    });
  }, [activeFilter, bookings]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="border-black/10 bg-white/90 backdrop-blur-2xl">
            <CardHeader>
              <Skeleton className="h-5 w-48 bg-slate-200" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full bg-slate-200" />
              <Skeleton className="h-4 w-2/3 bg-slate-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 backdrop-blur-xl">
        <CardContent className="p-6">
          <p className="text-sm text-red-800">
            Impossible de charger vos paiements pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-noka text-2xl font-bold uppercase tracking-wide">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Mes paiements
          </CardTitle>
          <CardDescription className="text-slate-600">
            Consultez le statut de paiement de vos reservations et reglez vos reservations en attente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveFilter('all')}
            className={
              activeFilter === 'all'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.18)]'
                : 'border-black/15 bg-white text-slate-700 hover:bg-slate-100'
            }
          >
            Tous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveFilter('due')}
            className={
              activeFilter === 'due'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.18)]'
                : 'border-black/15 bg-white text-slate-700 hover:bg-slate-100'
            }
          >
            A regler
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveFilter('paid')}
            className={
              activeFilter === 'paid'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.18)]'
                : 'border-black/15 bg-white text-slate-700 hover:bg-slate-100'
            }
          >
            Payes
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {paymentBookings.map(booking => {
          const amount = formatAmount(booking.totalCents || booking.priceCents, booking.currency);
          const due = isPaymentDue(booking);
          const paid = isPaymentPaid(booking);

          return (
            <Card key={booking.id} className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">{booking.service?.name || 'Reservation'}</p>
                  <p className="text-sm text-slate-600">
                    {booking.date} a {booking.startTime}
                  </p>
                  {amount && <p className="text-sm text-slate-600">Montant: {amount}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {due && <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">Paiement requis</Badge>}
                  {paid && <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Paiement valide</Badge>}
                  {!due && !paid && <Badge className="border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100">Statut en cours</Badge>}

                  <Button variant="outline" size="sm" asChild className="border-black/15 bg-white text-slate-700 hover:bg-slate-100">
                    <Link href={`/checkout?booking_id=${booking.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Details
                    </Link>
                  </Button>

                  {due && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        retryPaymentMutation.mutate(booking.id);
                      }}
                      disabled={
                        retryPaymentMutation.isPending && selectedBookingId === booking.id
                      }
                      className="border border-emerald-300/30 bg-gradient-to-r from-emerald-400 to-emerald-500 font-semibold text-black hover:from-emerald-300 hover:to-emerald-400"
                    >
                      {retryPaymentMutation.isPending && selectedBookingId === booking.id ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                      )}
                      Obtenir le lien de paiement
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {paymentBookings.length === 0 && (
        <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
          <CardContent className="p-8 text-center">
            <p className="font-medium">Aucun paiement pour ce filtre.</p>
            <p className="mt-1 text-sm text-slate-600">
              Changez de filtre pour afficher plus de reservations.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={Boolean(paymentLink)} onOpenChange={open => !open && setPaymentLink(null)}>
        <DialogContent className="border-black/10 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>Lien de paiement</DialogTitle>
            <DialogDescription className="text-slate-600">
              Utilisez ce lien pour finaliser le paiement de votre reservation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={paymentLink || ''}
              readOnly
              className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  if (!paymentLink) return;
                  await navigator.clipboard.writeText(paymentLink);
                  toast.success('Lien copie dans le presse-papiers.');
                }}
                className="border-black/15 bg-white text-slate-700 hover:bg-slate-100"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copier
              </Button>
              <Button
                onClick={() => {
                  if (!paymentLink) return;
                  window.open(paymentLink, '_blank', 'noopener,noreferrer');
                }}
                className="border border-emerald-300/30 bg-gradient-to-r from-emerald-400 to-emerald-500 font-semibold text-black hover:from-emerald-300 hover:to-emerald-400"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Payer maintenant
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentLink(null)} className="border-black/15 bg-white text-slate-700 hover:bg-slate-100">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
