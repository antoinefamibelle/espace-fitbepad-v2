'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

import { Button } from '@frontend/components/ui/button'
import { Input } from '@frontend/components/ui/input'
import { Label } from '@frontend/components/ui/label'

const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: ForgotPasswordValues) => {
    setServerError(null)
    try {
      await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      })
      setSubmitted(true)
    } catch {
      setServerError('Impossible de contacter le serveur. Veuillez réessayer.')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#1d1d1b] p-16">
        <div>
          <span className="font-noka text-sm font-semibold uppercase tracking-[0.25em] text-[#52ad77]">
            Fitbepad
          </span>
        </div>
        <div>
          <h1 className="font-noka text-6xl font-black uppercase leading-none tracking-tight text-white">
            Retrouvez<br />
            <span className="text-[#52ad77]">votre</span><br />
            accès.
          </h1>
          <p className="mt-8 max-w-xs text-sm leading-relaxed text-white/50">
            Nous vous enverrons un lien de réinitialisation à votre adresse email sous quelques instants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-white/20" />
          <span className="text-xs uppercase tracking-widest text-white/30">Fitness · Padel · Bien-être</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center bg-white px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-10 lg:hidden">
            <span className="font-noka text-sm font-semibold uppercase tracking-[0.25em] text-[#1d1d1b]">
              Fitbepad
            </span>
          </div>

          <Link
            href="/login"
            className="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/40 transition-colors hover:text-black/70 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à la connexion
          </Link>

          {submitted ? (
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#52ad77]/30 bg-[#52ad77]/10">
                <CheckCircle className="h-6 w-6 text-[#52ad77]" />
              </div>
              <h2 className="font-noka text-3xl font-bold uppercase tracking-tight text-[#1d1d1b]">
                Email envoyé
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-black/50">
                Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation dans quelques minutes. Pensez à vérifier vos spams.
              </p>
              <Link
                href="/login"
                className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#1d1d1b] underline underline-offset-4 hover:text-black/60 transition-colors cursor-pointer"
              >
                Revenir à la connexion
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="font-noka text-3xl font-bold uppercase tracking-tight text-[#1d1d1b]">
                Mot de passe oublié
              </h2>
              <p className="mt-1 text-sm text-black/40">
                Saisissez votre email pour recevoir un lien de réinitialisation.
              </p>

              <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-black/60">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...form.register('email')}
                    className="rounded-[var(--radius-md)] border-black/15 bg-[#f8f8f8] focus-visible:border-[#1d1d1b] focus-visible:ring-0"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                {serverError && (
                  <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="group w-full rounded-[var(--radius-md)] bg-[#1d1d1b] py-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-60 cursor-pointer"
                >
                  {form.formState.isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Envoyer le lien
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
