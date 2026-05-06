'use client';

import { motion } from 'framer-motion';
import { Check, Dumbbell, Zap, Star, Trophy } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import type { Subscription } from '@frontend/data/subscriptions';
import { LuxuryButton } from '../luxury';

const PLAN_ICONS: Record<string, ReactNode> = {
  fitness: <Dumbbell className="h-5 w-5" />,
  bienetre: <Zap className="h-5 w-5" />,
  premium: <Star className="h-5 w-5" />,
  espace: <Trophy className="h-5 w-5" />,
};

const getPlanIcon = (id: string) => {
  return PLAN_ICONS[id] ?? <Dumbbell className="h-5 w-5" />;
};

const SubscriptionCard = ({ subscription, index }: { subscription: Subscription; index: number }) => {
  const isHero = subscription.isPremium && !subscription.isPopular;
  const isPopular = subscription.isPopular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="relative flex h-full flex-col"
    >
      <div
        className={`relative flex h-full flex-col rounded-[var(--radius-lg)] border transition-colors duration-200 ${
          isHero
            ? 'border-[#1d1d1b] bg-[#1d1d1b] text-white'
            : 'border-black/12 bg-white text-[#1d1d1b] hover:border-black/30'
        }`}
      >
        {/* Popular badge */}
        {isPopular && (
          <div className="absolute -top-px left-6">
            <span className="inline-block rounded-b-[var(--radius-sm)] bg-[#52ad77] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Populaire
            </span>
          </div>
        )}

        <div className="flex flex-col flex-1 p-7 pt-8">
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] ${
              isHero ? 'bg-white/10 text-white' : 'bg-[#1d1d1b]/6 text-[#1d1d1b]'
            }`}>
              {getPlanIcon(subscription.id)}
            </div>
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${isHero ? 'text-white/40' : 'text-black/30'}`}>
                Abonnement
              </p>
              <h3 className={`font-noka text-lg font-black uppercase tracking-tight leading-tight ${isHero ? 'text-white' : 'text-[#1d1d1b]'}`}>
                {subscription.title.replace('Abonnement ', '')}
              </h3>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className={`font-noka text-4xl font-black tracking-tight ${isHero ? 'text-white' : 'text-[#1d1d1b]'}`}>
                {subscription.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
              </span>
              <span className={`text-sm ${isHero ? 'text-white/40' : 'text-black/35'}`}>
                /{subscription.period}
              </span>
            </div>
            <p className={`mt-1 text-xs ${isHero ? 'text-white/40' : 'text-black/35'}`}>
              {subscription.registrationFee === 0
                ? 'Frais d\'inscription offerts'
                : `+ ${subscription.registrationFee}€ frais d'inscription`}
            </p>
          </div>

          {/* Subtitle */}
          <p className={`mb-6 text-sm leading-relaxed ${isHero ? 'text-white/60' : 'text-black/50'}`}>
            {subscription.description}
          </p>

          {/* Benefits */}
          <ul className="mb-8 flex-1 space-y-2.5">
            {subscription.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                  isHero ? 'bg-[#52ad77]' : 'bg-[#1d1d1b]'
                }`}>
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
                <span className={`text-sm leading-snug ${isHero ? 'text-white/75' : 'text-black/65'}`}>
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-auto">
            <LuxuryButton
              variant={isHero ? 'ghost' : 'primary'}
              size="md"
              className={`w-full justify-center ${
                isHero
                  ? 'border-white/30 text-white hover:bg-white hover:text-[#1d1d1b]'
                  : ''
              }`}
            >
              {subscription.ctaText}
            </LuxuryButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptions() {
      try {
        const response = await fetch('/api/site/subscriptions', { cache: 'no-store' });
        const payload = await response.json();
        if (!isMounted || !payload?.success || !Array.isArray(payload.subscriptions)) return;
        setSubscriptions(payload.subscriptions);
      } catch (error) {
        console.error('Unable to load site subscriptions', error);
      }
    }

    loadSubscriptions();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-28">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black/30">
            Tarifs
          </p>
          <h2 className="font-noka text-section font-black uppercase tracking-tight text-[#1d1d1b]">
            Nos abonnements
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-black/50">
            Choisissez l'abonnement qui correspond à vos objectifs et votre style de vie.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {subscriptions.map((subscription, index) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              index={index}
            />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-xs text-black/30"
        >
          Engagement 12 mois · Sans frais cachés · Résiliation selon conditions générales
        </motion.p>
      </div>
    </section>
  );
}
