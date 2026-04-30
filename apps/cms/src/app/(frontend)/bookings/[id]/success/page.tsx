'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useParams } from 'next/navigation'

import { CheckoutStatusView } from '../../../checkout/components/CheckoutStatusView'

const queryClient = new QueryClient()

export default function BookingSuccessPage() {
  const params = useParams<{ id: string }>()
  const bookingId = typeof params?.id === 'string' ? params.id : null

  return (
    <QueryClientProvider client={queryClient}>
      <CheckoutStatusView bookingId={bookingId} context="success" />
      <Toaster richColors />
    </QueryClientProvider>
  )
}
