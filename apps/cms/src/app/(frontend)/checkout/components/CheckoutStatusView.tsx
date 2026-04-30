'use client';

import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@frontend/components/ui/alert';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { Loader2 as Spinner } from 'lucide-react';
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

function ContextAlert({ context }: { context: ViewContext }) {
  if (context === 'success') {
    return (
      <Alert>
        <AlertTitle>Retour de paiement</AlertTitle>
        <AlertDescription>
          Verification du paiement en cours. Le statut sera mis a jour automatiquement.
        </AlertDescription>
      </Alert>
    );
  }

  if (context === 'cancel') {
    return (
      <Alert variant="destructive">
        <AlertTitle>Paiement annule</AlertTitle>
        <AlertDescription>
          Vous avez annule le paiement. Vous pouvez relancer le paiement quand vous le souhaitez.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

export function CheckoutStatusView({ bookingId, context }: CheckoutStatusViewProps) {
  const normalizedBookingId = bookingId ?? '';
  const refetchInterval = context === 'default' ? false : 3000;
  const retryLabel = useMemo(
    () => (context === 'cancel' ? 'Relancer le paiement' : 'Completer le paiement'),
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
          toast.success('Redirection vers la page de paiement...');
          window.location.href = data.url;
          return;
        }
        toast.error('URL de paiement non recue. Veuillez reessayer.');
      },
      onError: (mutationError) => {
        const axiosError = mutationError as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error || 'Une erreur est survenue.';
        toast.error(`Impossible de relancer le paiement: ${errorMessage}`);
      },
    });

  if (!bookingId) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>ID de reservation manquant dans l&apos;URL.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center text-center">
        <Spinner className="h-12 w-12 animate-spin mb-4" />
        <p className="text-lg">Chargement des details de votre reservation...</p>
      </div>
    );
  }

  if (isError) {
    const axiosError = error as AxiosError<{ error?: string }>;
    const errorMessage = axiosError.response?.data?.error || error?.message || 'Erreur inconnue';
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>Impossible de recuperer la reservation: {errorMessage}.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-10 px-4 flex flex-col items-center">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Donnees non disponibles</AlertTitle>
          <AlertDescription>Aucune donnee de reservation n&apos;a ete trouvee.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col items-center space-y-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Statut de votre reservation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ContextAlert context={context} />

          {booking.status === 'confirmed' && (
            <Alert>
              <AlertTitle>Paiement reussi</AlertTitle>
              <AlertDescription>Votre seance est confirmee.</AlertDescription>
            </Alert>
          )}
          {booking.status === 'pending_payment' && (
            <Alert>
              <AlertTitle>Paiement en attente</AlertTitle>
              <AlertDescription>Completez le paiement pour confirmer votre reservation.</AlertDescription>
            </Alert>
          )}
          {booking.status === 'failed_payment' && (
            <Alert variant="destructive">
              <AlertTitle>Paiement echoue</AlertTitle>
              <AlertDescription>Le paiement a echoue. Vous pouvez retenter.</AlertDescription>
            </Alert>
          )}
          {booking.paymentStatus === 'expired' && (
            <Alert variant="destructive">
              <AlertTitle>Session expiree</AlertTitle>
              <AlertDescription>La session Stripe a expire. Vous pouvez relancer le paiement.</AlertDescription>
            </Alert>
          )}

          <div className="border-t pt-4">
            <p><strong>Service:</strong> {booking.service?.name}</p>
            <p><strong>Date:</strong> {booking.date ? new Date(booking.date).toLocaleDateString('fr-FR') : new Date(booking.startTime).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heure:</strong> {booking.startTime}</p>
            <p><strong>Montant:</strong> {((booking.totalCents || 0) / 100).toFixed(2)}EUR</p>
          </div>

          {booking.status === 'pending_payment' && (
            <Button className="w-full" onClick={() => handleRetryPayment(booking.id)} disabled={isRetryingPayment}>
              {isRetryingPayment ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
              {retryLabel}
            </Button>
          )}

          <div className="flex justify-between items-center mt-6">
            <Link href="/profile" passHref>
              <Button variant="outline">Mes reservations</Button>
            </Link>
            <Link href="/" passHref>
              <Button>Retour a l&apos;accueil</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
