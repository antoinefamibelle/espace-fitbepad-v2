'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CheckoutCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id')

  useEffect(() => {
    if (!bookingId) return
    router.replace(`/bookings/${encodeURIComponent(bookingId)}/cancel`)
  }, [bookingId, router])

  return <div className="container mx-auto px-4 py-10">Redirection vers votre reservation...</div>
}
