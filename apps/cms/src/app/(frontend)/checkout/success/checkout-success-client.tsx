'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function CheckoutSuccessClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!bookingId) return

    const nextUrl = sessionId
      ? `/bookings/${encodeURIComponent(bookingId)}/success?session_id=${encodeURIComponent(sessionId)}`
      : `/bookings/${encodeURIComponent(bookingId)}/success`
    router.replace(nextUrl)
  }, [bookingId, router, sessionId])

  return <div className="container mx-auto px-4 py-10">Redirection vers votre reservation...</div>
}
