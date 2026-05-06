import { Suspense } from 'react'
import { ResetPasswordClient } from './reset-password-client'

const fallback = (
  <div className="container mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-12 text-sm text-slate-500">
    Chargement…
  </div>
)

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={fallback}>
      <ResetPasswordClient />
    </Suspense>
  )
}
