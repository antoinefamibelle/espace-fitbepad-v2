'use client';

import React from 'react';
import { SignInButton, useUser } from '@frontend/lib/auth/client';
import { Button } from '@frontend/components/ui/button';
import { Check, Lock, Shield, History, ArrowRight } from 'lucide-react';

interface AuthenticationStepProps {
  onNext?: () => void;
}

const benefits = [
  { icon: Shield, title: 'Sécurisé', description: 'Vos données personnelles sont protégées' },
  { icon: History, title: 'Historique', description: 'Suivez et gérez toutes vos réservations' },
  { icon: Lock, title: 'Accès rapide', description: 'Reconnectez-vous en un clic la prochaine fois' },
];

export function AuthenticationStep({ onNext }: AuthenticationStepProps) {
  const { user, isLoaded } = useUser();

  React.useEffect(() => {
    if (isLoaded && user && onNext) onNext();
  }, [isLoaded, user, onNext]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-[#1d1d1b]" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="max-w-md space-y-5">
        <h2 className="font-noka text-xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-2xl">
          Connexion
        </h2>
        <div className="rounded-[var(--radius-lg)] border border-[#52ad77]/25 bg-[#52ad77]/6 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#52ad77]">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1b]">Connecté en tant que</p>
              <p className="text-sm text-black/50">{user.firstName} {user.lastName}</p>
            </div>
          </div>
        </div>
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[#1d1d1b] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-black transition-colors cursor-pointer"
          >
            Continuer vers le récapitulatif
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-noka text-xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-2xl">
          Connexion requise
        </h2>
        <p className="mt-1 text-sm text-black/40">
          Connectez-vous pour finaliser votre réservation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Benefits */}
        <div className="rounded-[var(--radius-lg)] border border-black/10 bg-white p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">
            Pourquoi se connecter
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.title} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-black/5">
                    <Icon className="h-4 w-4 text-[#1d1d1b]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d1d1b]">{benefit.title}</p>
                    <p className="text-xs text-black/40">{benefit.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Sign in */}
        <div className="flex flex-col justify-center rounded-[var(--radius-lg)] border border-black/10 bg-white p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">
            Votre compte
          </p>
          <h3 className="font-noka text-lg font-black uppercase tracking-tight text-[#1d1d1b]">
            Se connecter
          </h3>
          <p className="mt-1 mb-6 text-sm text-black/40">
            L&apos;ouverture se fait dans une fenêtre sécurisée.
          </p>

          <SignInButton mode="modal">
            <Button className="w-full rounded-[var(--radius-md)] bg-[#1d1d1b] font-bold text-white hover:bg-black cursor-pointer">
              <ArrowRight className="mr-2 h-4 w-4" />
              Se connecter / S&apos;inscrire
            </Button>
          </SignInButton>

          <p className="mt-4 text-center text-xs text-black/25">
            En vous connectant, vous acceptez nos{' '}
            <span className="underline">conditions d&apos;utilisation</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
