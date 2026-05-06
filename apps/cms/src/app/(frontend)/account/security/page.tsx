'use client'

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

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export default function AccountSecurityPage() {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: ChangePasswordValues) => {
    const response = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      toast.error(data?.error || 'Impossible de modifier le mot de passe')
      return
    }

    form.reset()
    toast.success('Mot de passe modifie avec succes')
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Securite du compte</CardTitle>
          <CardDescription>
            Modifiez votre mot de passe en confirmant votre mot de passe actuel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...form.register('currentPassword')}
              />
              {form.formState.errors.currentPassword ? (
                <p className="text-sm text-red-600">{form.formState.errors.currentPassword.message}</p>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" type="password" autoComplete="new-password" {...form.register('newPassword')} />
              {form.formState.errors.newPassword ? (
                <p className="text-sm text-red-600">{form.formState.errors.newPassword.message}</p>
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
              {form.formState.isSubmitting ? 'Mise a jour...' : 'Mettre a jour le mot de passe'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
