'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

import { Button } from '@frontend/components/ui/button';
import { Input } from '@frontend/components/ui/input';
import { Label } from '@frontend/components/ui/label';

const errorLabels: Record<string, string> = {
  oauth_state: 'La session OAuth a expiré. Réessayez.',
  oauth_config: 'La configuration OAuth est incomplète.',
  oauth_token: 'Impossible de récupérer le jeton OAuth.',
};

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = useMemo(() => searchParams.get('redirect') || '/profile', [searchParams]);
  const error = searchParams.get('error');
  const passwordReset = searchParams.get('passwordReset') === '1';
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isSignUp = mode === 'signup';

  async function submitPasswordAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const endpoint = isSignUp ? '/api/auth/password/register' : '/api/auth/password/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const body = (await response.json()) as {
        success: boolean;
        error?: string;
        user?: { isAdmin?: boolean };
      };

      if (!response.ok || !body.success) {
        setFormError(body.error || "Échec de l'authentification");
        return;
      }

      const target = body.user?.isAdmin ? '/admin' : redirect;
      router.push(target);
      router.refresh();
    } catch {
      setFormError('Impossible de contacter le serveur.');
    } finally {
      setIsSubmitting(false);
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
            Votre espace<br />
            <span className="text-[#52ad77]">fitness</span><br />
            vous attend.
          </h1>
          <p className="mt-8 max-w-xs text-sm leading-relaxed text-white/50">
            Accédez à vos réservations, abonnements et informations personnelles depuis votre espace membre.
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

          {/* Mode toggle */}
          <div className="mb-8 flex border-b border-black/10">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`pb-3 pr-6 text-sm font-semibold uppercase tracking-wide transition-colors ${
                !isSignUp
                  ? 'border-b-2 border-[#1d1d1b] text-[#1d1d1b]'
                  : 'text-black/30 hover:text-black/60'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`pb-3 pr-6 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isSignUp
                  ? 'border-b-2 border-[#1d1d1b] text-[#1d1d1b]'
                  : 'text-black/30 hover:text-black/60'
              }`}
            >
              Créer un compte
            </button>
          </div>

          <h2 className="font-noka text-3xl font-bold uppercase tracking-tight text-[#1d1d1b]">
            {isSignUp ? 'Rejoignez-nous' : 'Bon retour'}
          </h2>
          <p className="mt-1 text-sm text-black/40">
            {isSignUp
              ? 'Créez votre espace membre Fitbepad.'
              : 'Connectez-vous à votre espace membre.'}
          </p>

          {/* Alerts */}
          {error && (
            <div className="mt-6 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorLabels[error] || 'Erreur de connexion.'}
            </div>
          )}
          {passwordReset && (
            <div className="mt-6 rounded-[var(--radius-md)] border border-[#52ad77]/30 bg-[#52ad77]/10 px-4 py-3 text-sm text-[#1d1d1b]">
              Mot de passe réinitialisé. Vous pouvez vous connecter.
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={submitPasswordAuth}>
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wide text-black/60">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    className="rounded-[var(--radius-md)] border-black/15 bg-[#f8f8f8] focus-visible:border-[#1d1d1b] focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wide text-black/60">
                    Nom
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    className="rounded-[var(--radius-md)] border-black/15 bg-[#f8f8f8] focus-visible:border-[#1d1d1b] focus-visible:ring-0"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-black/60">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="rounded-[var(--radius-md)] border-black/15 bg-[#f8f8f8] focus-visible:border-[#1d1d1b] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-black/60">
                  Mot de passe
                </Label>
                {!isSignUp && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-black/40 underline underline-offset-2 hover:text-black/70 transition-colors"
                  >
                    Oublié ?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="rounded-[var(--radius-md)] border-black/15 bg-[#f8f8f8] focus-visible:border-[#1d1d1b] focus-visible:ring-0"
              />
            </div>

            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="group w-full rounded-[var(--radius-md)] bg-[#1d1d1b] py-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                'Chargement...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isSignUp ? 'Créer mon compte' : 'Se connecter'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-black/10" />
            <span className="text-xs text-black/30">ou</span>
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <p className="mt-6 text-center text-xs text-black/30">
            En continuant, vous acceptez les{' '}
            <Link href="/legal" className="underline hover:text-black/60 transition-colors">
              conditions d&apos;utilisation
            </Link>{' '}
            de Fitbepad.
          </p>
        </div>
      </div>
    </div>
  );
}
