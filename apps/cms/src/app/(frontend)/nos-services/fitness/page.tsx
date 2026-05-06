'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { Coach } from '@frontend/data/coaches';

const equipment = [
  {
    number: '01',
    title: 'Salle de fitness Technogym',
    description:
      "400m² d'équipements de dernière génération. Cardio, musculation, libre. La marque de référence des clubs premium mondiaux.",
  },
  {
    number: '02',
    title: 'Zone fonctionnelle',
    description:
      'CrossFit, kettlebell, TRX, battle ropes. Un espace dédié au training fonctionnel et à la préparation physique.',
  },
  {
    number: '03',
    title: 'Salle de cours collectifs',
    description:
      'Planning hebdomadaire : HIIT, yoga, pilates, stretching. Encadrés par nos coachs certifiés, en groupe ou en petit comité.',
  },
  {
    number: '04',
    title: 'Studio de vélo indoor',
    description:
      'Séances de biking en musique. Endurance, cardio, dépassement. La discipline qui réveille.',
  },
  {
    number: '05',
    title: 'Terrasse extérieure',
    description:
      "120m² en plein air. Entraînement outdoor, étirements, récupération. Une bouffée d'air rare dans un club fitness.",
  },
];

const commitments = [
  { value: '400m²', label: 'de fitness' },
  { value: 'Technogym', label: 'équipements' },
  { value: '06h–22h', label: 'ouverture' },
  { value: '7j/7', label: 'sans exception' },
];

const schedule = [
  { day: 'Lundi – Vendredi', hours: '06h00 – 22h00' },
  { day: 'Samedi', hours: '07h00 – 21h00' },
  { day: 'Dimanche', hours: '08h00 – 20h00' },
];

type CoachCard = {
  id: string;
  src: string;
  name: string;
  specialty: string;
};

const fallbackCoachCards: CoachCard[] = [
  {
    id: 'fallback-1',
    src: '/images/coach/coach-1.jpg',
    name: 'Coach certifié',
    specialty: 'Musculation & préparation physique',
  },
  {
    id: 'fallback-2',
    src: '/images/coach/coach-2.jpg',
    name: 'Coach certifié',
    specialty: 'Cardio & cours collectifs',
  },
  {
    id: 'fallback-3',
    src: '/images/coach/coach-3.jpg',
    name: 'Coach certifié',
    specialty: 'Nutrition & bien-être',
  },
];

export default function FitnessPage() {
  const [fitnessCoaches, setFitnessCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadFitnessCoaches() {
      try {
        const response = await fetch('/api/site/coaches?category=fitness', { cache: 'no-store' });
        const payload = await response.json();
        if (!isMounted || !payload?.success || !Array.isArray(payload.coaches)) return;
        setFitnessCoaches(payload.coaches);
      } catch (error) {
        console.error('Unable to load fitness coaches', error);
      }
    }

    loadFitnessCoaches();
    return () => {
      isMounted = false;
    };
  }, []);

  const coachCards = useMemo<CoachCard[]>(() => {
    if (fitnessCoaches.length === 0) {
      return fallbackCoachCards;
    }

    return fitnessCoaches.slice(0, 3).map((coach, index) => ({
      id: coach.id || `fitness-${index}`,
      src: coach.image || fallbackCoachCards[index % fallbackCoachCards.length].src,
      name: coach.name || 'Coach certifié',
      specialty: coach.specialties?.[0] || 'Coaching personnalisé',
    }));
  }, [fitnessCoaches]);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen w-full overflow-hidden py-0 bg-[#1d1d1b]">
        <Image
          src="/images/fitness-hero.jpg"
          alt="Salle de fitness premium — L'Espace Verberie"
          fill
          className="object-cover opacity-55"
          priority
        />

        <div className="relative z-10 flex flex-col justify-end min-h-screen px-6 md:px-12 lg:px-20 pb-0">
          <div className="max-w-6xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-16 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>

            <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-6">
              Fitness — Verberie, Oise
            </p>

            <h1 className="text-hero text-white mb-8 leading-[0.92]">
              400m² pour<br />
              <span className="text-[#52ad77]">repousser</span><br />
              vos limites.
            </h1>

            <p className="text-white/65 max-w-xl text-lg leading-relaxed mb-10">
              Équipements Technogym, coachs certifiés et cinq zones d'entraînement distinctes.
              Un seul endroit pour tout faire — et tout dépasser.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
              >
                Commencer maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/nos-services/les-cours"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-medium text-base rounded-[var(--radius-md)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                Voir les cours collectifs
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-white/15 grid grid-cols-2 md:grid-cols-4">
            {commitments.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-8 px-6 ${i < commitments.length - 1 ? 'border-r border-white/15' : ''}`}
              >
                <p className="text-white text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/50 text-sm tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÉQUIPEMENTS ─── */}
      <section className="bg-white py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-2xl">
            <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
              Nos espaces
            </p>
            <h2 className="text-section text-[#1d1d1b]">
              Cinq zones.<br />Un seul objectif.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8">
            {equipment.map((item) => (
              <div
                key={item.number}
                className="bg-white p-10 group hover:bg-[#1d1d1b] transition-colors duration-300"
              >
                <span className="block text-black/10 text-5xl font-bold mb-8 tabular-nums group-hover:text-white/10 transition-colors">
                  {item.number}
                </span>
                <h3 className="text-[#1d1d1b] font-bold text-lg mb-4 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                  {item.description}
                </p>
              </div>
            ))}

            {/* CTA cell */}
            <div className="bg-[#52ad77] p-10 flex flex-col justify-between">
              <p className="text-white text-sm font-semibold tracking-[0.2em] uppercase mb-6">
                Prêt à commencer ?
              </p>
              <div>
                <h3 className="text-white font-bold text-xl mb-6">
                  Votre première session vous attend.
                </h3>
                <Link
                  href="/reservation"
                  className="inline-flex items-center gap-2 bg-white text-[#52ad77] px-6 py-3 font-bold text-sm rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
                >
                  Réserver
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK ─── */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden py-0">
        <Image
          src="/images/spaces/fitness.webp"
          alt="Salle de musculation Technogym — L'Espace"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1d1d1b]/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto w-full">
            <p className="text-white/60 text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Technogym
            </p>
            <h2 className="text-section text-white max-w-lg">
              L'équipement des meilleurs clubs au monde.
            </h2>
          </div>
        </div>
      </section>

      {/* ─── BIKE + SCHEDULE ─── */}
      <section className="bg-[#1d1d1b] py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative h-[440px] rounded-[var(--radius-lg)] overflow-hidden">
              <Image
                src="/images/spaces/biking.jpg"
                alt="Studio de vélo indoor — L'Espace"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
                Horaires
              </p>
              <h2 className="text-section text-white mb-10">
                Ouvert quand<br />vous en avez besoin.
              </h2>

              <div className="space-y-0 mb-12">
                {schedule.map((item, i) => (
                  <div
                    key={item.day}
                    className={`flex justify-between items-center py-6 ${
                      i < schedule.length - 1 ? 'border-b border-white/10' : ''
                    }`}
                  >
                    <span className="text-white/50 text-base">{item.day}</span>
                    <span className="text-white font-semibold text-base">{item.hours}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
              >
                Réserver une séance
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COACHES STRIP ─── */}
      <section className="bg-white py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
                Coaching
              </p>
              <h2 className="text-section text-[#1d1d1b]">
                Des coachs qui<br />vous connaissent.
              </h2>
            </div>
            <Link
              href="/nos-services/les-coach"
              className="inline-flex items-center gap-2 border border-black/20 text-[#1d1d1b] px-6 py-3 font-medium text-sm rounded-[var(--radius-md)] hover:bg-[#1d1d1b] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Découvrir nos coachs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coachCards.map((coach) => (
              <div key={coach.id} className="group relative overflow-hidden rounded-[var(--radius-lg)] bg-[#f5f5f5]">
                <div className="relative h-[340px]">
                  <Image
                    src={coach.src}
                    alt={coach.name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#1d1d1b]/30" />
                </div>
                <div className="p-6">
                  <p className="text-[#1d1d1b] font-bold text-base mb-1">{coach.name}</p>
                  <p className="text-gray-500 text-sm">{coach.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-[#1d1d1b] py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-section text-white mb-4">
                La salle vous attend.<br />
                <span className="text-white/35">Vous, aussi.</span>
              </h2>
              <p className="text-white/55 text-lg leading-relaxed">
                Réservez votre première séance ou venez nous rencontrer.
                Pas d'abonnement forcé, pas de frais cachés.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
              >
                Réserver maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white px-8 py-4 font-medium text-base rounded-[var(--radius-md)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
