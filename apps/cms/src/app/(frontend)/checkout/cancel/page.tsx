import { Suspense } from 'react'
import { CheckoutCancelClient } from './checkout-cancel-client'

const fallback = (
  <div className="container mx-auto px-4 py-10">Redirection vers votre reservation...</div>
)

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={fallback}>
      <CheckoutCancelClient />
    </Suspense>
  )
}
