'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@frontend/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@frontend/components/ui/card'
import { Input } from '@frontend/components/ui/input'
import { Label } from '@frontend/components/ui/label'

const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caracteres')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre')

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) {
      toast.error('Token de reinitialisation manquant')
      return
    }

    const response = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password: values.password,
      }),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { errors?: unknown; message?: string } | null
      const fallback = 'Impossible de reinitialiser votre mot de passe'
      toast.error(data?.message || fallback)
      return
    }

    toast.success('Mot de passe mis a jour avec succes')
    router.push('/login?passwordReset=1')
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reinitialiser le mot de passe</CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe securise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token ? (
            <p className="text-sm text-red-600">
              Le lien de reinitialisation est invalide.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
                {form.formState.errors.password ? (
                  <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...form.register('confirmPassword')}
                />
                {form.formState.errors.confirmPassword ? (
                  <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
                ) : null}
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Enregistrement...' : 'Valider'}
              </Button>
            </form>
          )}

          <p className="text-sm text-slate-600">
            <Link href="/login" className="underline">
              Retour a la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
