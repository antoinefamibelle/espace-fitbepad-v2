'use client';

import { useUserBookings } from '@frontend/lib/hooks/use-user-bookings';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Skeleton } from '@frontend/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@frontend/components/ui/alert';
import { Separator } from '@frontend/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@frontend/components/ui/dialog';
import moment from 'moment';
import 'moment/locale/fr';
import type { BookingResponseWithDetails } from 'shared';
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  RefreshCw,
  ExternalLink,
  Ban,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { CalendarExport } from '@frontend/components/ui/calendar-export';
import type { BookingCalendarData } from '@frontend/lib/utils/calendar';
import { internalApi } from '@frontend/lib/api';
import { toast } from 'sonner';
import { useCancelBooking } from '@frontend/lib/hooks/use-user-bookings';

// Set moment to French locale
moment.locale('fr');

interface PaymentRetryResponse {
  paymentUrl: string;
}

type BookingFilter = 'all' | 'upcoming' | 'past' | 'payment_due' | 'cancelled';
const PAGE_SIZE = 10;

export function UserProfileBookings() {
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('all');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [activePaymentBookingId, setActivePaymentBookingId] = useState<string | null>(
    null,
  );
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponseWithDetails | null>(
    null,
  );

  const { data: bookings, isLoading, error } = useUserBookings({ limit, offset: 0 });
  const cancelBookingMutation = useCancelBooking();

  const retryPaymentMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await internalApi.post<PaymentRetryResponse>(
        `/api/bookings/${bookingId}/retry-payment`,
        {},
      );
      return response.data;
    },
    onSuccess: (data, bookingId) => {
      setActivePaymentBookingId(null);
      window.open(data.paymentUrl, '_blank', 'noopener,noreferrer');
      toast.success('Lien de paiement genere. Vous pouvez finaliser le paiement.');
    },
    onError: () => {
      setActivePaymentBookingId(null);
      toast.error('Impossible de generer le lien de paiement.');
    },
  });

  const onRetryPayment = (bookingId: string) => {
    setActivePaymentBookingId(bookingId);
    retryPaymentMutation.mutate(bookingId);
  };

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    const now = moment();

    return bookings.filter(booking => {
      const bookingDateTime = moment(`${booking.date} ${booking.startTime}`);
      const isUpcoming = bookingDateTime.isAfter(now);

      switch (activeFilter) {
        case 'upcoming':
          return isUpcoming && booking.status !== 'cancelled';
        case 'past':
          return !isUpcoming && booking.status !== 'cancelled';
        case 'payment_due':
          return (
            booking.status === 'pending_payment' || booking.status === 'failed_payment'
          );
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  }, [activeFilter, bookings]);

  const hasMoreBookings = activeFilter === 'all' && (bookings?.length || 0) >= limit;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-black/10 bg-white/90 backdrop-blur-2xl">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 bg-slate-200" />
              <Skeleton className="mt-1 h-4 w-1/2 bg-slate-200" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full bg-slate-200" />
              <Skeleton className="h-4 w-5/6 bg-slate-200" />
              <Skeleton className="h-4 w-1/3 bg-slate-200" />
              <Skeleton className="mt-3 h-9 w-32 bg-slate-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50 text-red-800">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger vos réservations. Veuillez réessayer plus tard.
          {error.message && (
            <p className="mt-2 text-xs">Détail: {error.message}</p>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="mb-4 h-12 w-12 text-slate-400" />
          <h3 className="mb-2 font-noka text-2xl font-bold uppercase tracking-wide">Aucune réservation</h3>
          <p className="mb-6 text-center text-slate-600">
            Vous n&apos;avez aucune réservation pour le moment.
          </p>
          <Button variant="outline" asChild className="border-black/15 bg-white text-slate-700 hover:bg-slate-100">
            <Link href="/nos-services/les-cours">Réserver un service</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusConfig = (status: string | undefined | null) => {
    if (!status)
      return {
        text: 'Statut inconnu',
        variant: 'secondary' as const,
        icon: AlertCircle,
        className: 'border-slate-200 bg-slate-100 text-slate-700',
      };

    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          text: 'Confirmée',
          variant: 'default' as const,
          icon: CheckCircle,
          className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        };
      case 'pending_payment':
        return {
          text: 'En attente de paiement',
          variant: 'secondary' as const,
          icon: CreditCard,
          className: 'border-amber-200 bg-amber-50 text-amber-700',
        };
      case 'failed_payment':
        return {
          text: 'Paiement échoué',
          variant: 'destructive' as const,
          icon: XCircle,
          className: 'border-red-200 bg-red-50 text-red-700',
        };
      case 'cancelled':
        return {
          text: 'Annulée',
          variant: 'secondary' as const,
          icon: XCircle,
          className: 'border-slate-200 bg-slate-100 text-slate-700',
        };
      case 'completed':
        return {
          text: 'Terminée',
          variant: 'default' as const,
          icon: CheckCircle,
          className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        };
      case 'no_show':
        return {
          text: 'Absence',
          variant: 'secondary' as const,
          icon: AlertCircle,
          className: 'border-slate-200 bg-slate-100 text-slate-700',
        };
      default:
        return {
          text: status.charAt(0).toUpperCase() + status.slice(1),
          variant: 'secondary' as const,
          icon: AlertCircle,
          className: 'border-slate-200 bg-slate-100 text-slate-700',
        };
    }
  };

  // Convert UserBooking to CalendarData format
  const convertToCalendarData = (booking: BookingResponseWithDetails): BookingCalendarData => {
    // Default durations for different treatments (in minutes)
    const getDefaultDuration = (serviceName?: string): number => {
      if (!serviceName) return 60;

      return 60; // Default fallback
    };

    const serviceDuration = getDefaultDuration(booking.service?.name);
    const startMoment = moment(
      `${booking.date} ${booking.startTime}`,
      'YYYY-MM-DD HH:mm',
    );
    const endMoment = startMoment.clone().add(serviceDuration, 'minutes');

    return {
      id: booking.id,
      treatmentName: booking.service?.name || 'Service Espace Sports',
      centerName: booking.service?.name || 'Espace Sports',
      centerAddress: booking.service?.description || 'Espace Sports',
      date: booking.date || new Date(booking.startTime).toISOString().slice(0, 10),
      startTime: booking.startTime,
      endTime: endMoment.format('HH:mm'),
      duration: serviceDuration,
      website: 'https://espacesports.com',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-noka text-2xl font-bold uppercase tracking-wide">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Mes Réservations
          </CardTitle>
          <CardDescription className="text-slate-600">
            Consultez vos rendez-vous, leurs details et les actions disponibles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-2 flex items-center gap-2 text-sm text-slate-600">
              <Filter className="h-4 w-4" />
              Filtres
            </div>
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'upcoming', label: 'A venir' },
              { id: 'past', label: 'Passees' },
              { id: 'payment_due', label: 'Paiement a regler' },
              { id: 'cancelled', label: 'Annulees' },
            ].map(filter => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter(filter.id as BookingFilter)}
                className={
                  activeFilter === filter.id
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.18)]'
                    : 'border-black/15 bg-white text-slate-700 hover:bg-slate-100'
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking: BookingResponseWithDetails) => {
          const statusConfig = getStatusConfig(booking.status);
          const StatusIcon = statusConfig.icon;
          const bookingDateTime = moment(
            `${booking.date} ${booking.startTime}`,
          );
          const isUpcoming = bookingDateTime.isAfter(moment());
          const canRetryPayment =
            booking.status === 'pending_payment' || booking.status === 'failed_payment';
          const canCancelBooking =
            booking.status !== 'cancelled' && booking.status !== 'completed';

          return (
            <Card key={booking.id} className="overflow-hidden border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold">
                      {booking.service?.name || 'Traitement non spécifié'}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {bookingDateTime.format('dddd DD MMMM YYYY')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{bookingDateTime.format('HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={statusConfig.variant}
                    className={`flex items-center gap-1 border ${statusConfig.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.text}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">

                <Separator className="bg-slate-200" />

                {/* Mobile Calendar Export - only for confirmed upcoming bookings */}
                {booking.status === 'confirmed' && isUpcoming && (
                  <div className="sm:hidden">
                    <CalendarExport
                      booking={convertToCalendarData(booking)}
                      variant="ghost"
                      size="sm"
                      showLabel={true}
                      className="w-full justify-start border border-black/10 bg-white text-slate-700 hover:bg-slate-100"
                    />
                  </div>
                )}

                {/* Additional Information */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    {isUpcoming ? (
                      <span className="font-semibold text-emerald-600">
                        Dans {bookingDateTime.fromNow()}
                      </span>
                    ) : (
                      <span>Il y a {moment().to(bookingDateTime, true)}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {canRetryPayment && (
                      <Button
                        onClick={() => onRetryPayment(booking.id)}
                        disabled={
                          retryPaymentMutation.isPending &&
                          activePaymentBookingId === booking.id
                        }
                        size="sm"
                        className="border border-emerald-300/30 bg-gradient-to-r from-emerald-400 to-emerald-500 font-semibold text-black hover:from-emerald-300 hover:to-emerald-400"
                      >
                        {retryPaymentMutation.isPending &&
                        activePaymentBookingId === booking.id ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        {booking.status === 'failed_payment'
                          ? 'Reessayer le paiement'
                          : 'Payer'}
                      </Button>
                    )}

                    {canCancelBooking && (
                      <Dialog
                        open={bookingToCancel?.id === booking.id}
                        onOpenChange={open => setBookingToCancel(open ? booking : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-black/15 bg-white text-slate-700 hover:bg-slate-100">
                            <Ban className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="border-black/10 bg-white text-slate-900">
                          <DialogHeader>
                            <DialogTitle>Annuler cette reservation ?</DialogTitle>
                            <DialogDescription className="text-slate-600">
                              Cette action annulera votre reservation et ne peut pas etre annulee.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setBookingToCancel(null)}
                              disabled={cancelBookingMutation.isPending}
                              className="border-black/15 bg-white text-slate-700 hover:bg-slate-100"
                            >
                              Conserver
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                cancelBookingMutation.mutate(booking.id, {
                                  onSuccess: () => setBookingToCancel(null),
                                });
                              }}
                              disabled={cancelBookingMutation.isPending}
                            >
                              {cancelBookingMutation.isPending
                                ? 'Annulation...'
                                : 'Confirmer l annulation'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Calendar Export - only for confirmed bookings that are upcoming */}
                    {booking.status === 'confirmed' && isUpcoming && (
                      <CalendarExport
                        booking={convertToCalendarData(booking)}
                        variant="outline"
                        size="sm"
                        showLabel={false}
                        className="hidden border-black/15 bg-white text-slate-700 hover:bg-slate-100 sm:flex"
                      />
                    )}

                    <Button variant="outline" size="sm" asChild className="border-black/15 bg-white text-slate-700 hover:bg-slate-100">
                      <Link href={`/checkout?booking_id=${booking.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </Link>
                    </Button>

                    {/* Contact button - only show for non-cancelled bookings */}
                    {booking.status !== 'cancelled' && (
                      <Button variant="outline" size="sm" asChild className="border-black/15 bg-white text-slate-700 hover:bg-slate-100">
                        <Link href="/contact">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Contacter</span>
                          <span className="sm:hidden">Contact</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBookings.length === 0 && (
        <Card className="border-black/10 bg-white/90 text-slate-900 backdrop-blur-2xl">
          <CardContent className="py-10 text-center">
            <p className="font-medium">Aucune reservation pour ce filtre.</p>
            <p className="mt-1 text-sm text-slate-600">
              Essayez un autre filtre pour voir vos reservations.
            </p>
          </CardContent>
        </Card>
      )}

      {hasMoreBookings && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setLimit(prev => prev + PAGE_SIZE)} className="border-black/15 bg-white text-slate-700 hover:bg-slate-100">
            Voir plus de reservations
          </Button>
        </div>
      )}
    </div>
  );
}
