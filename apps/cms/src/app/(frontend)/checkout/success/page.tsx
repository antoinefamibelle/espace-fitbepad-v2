import { Suspense } from 'react'
import { CheckoutSuccessClient } from './checkout-success-client'

const fallback = (
  <div className="container mx-auto px-4 py-10">Redirection vers votre reservation...</div>
)

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={fallback}>
      <CheckoutSuccessClient />
    </Suspense>
  )
}
