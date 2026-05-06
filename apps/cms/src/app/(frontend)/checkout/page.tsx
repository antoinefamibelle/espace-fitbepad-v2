'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CheckoutStatusView } from './components/CheckoutStatusView';

// React Query client (should ideally be provided globally in _app.tsx or layout.tsx)
const queryClient = new QueryClient();

const CheckoutPageContent = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  return <CheckoutStatusView bookingId={bookingId} context="default" />;
};

// Main component that provides QueryClient
export default function CheckoutPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutPageContent />
      </Suspense>
      <Toaster richColors />
    </QueryClientProvider>
  );
}
