'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Users, Clock } from 'lucide-react';

const universes = [
  {
    id: 'fitness',
    label: 'FITNESS',
    color: '#ffffff',
    accent: '#1d1d1b',
    image: '/images/spaces/fitness.webp',
    headline: 'Repoussez vos limites',
    tagline: 'Des espaces techniques pour une progression complète, en autonomie ou accompagnée.',
    spaces: [
      { name: 'Salle de fitness', detail: '400m² · Technogym' },
      { name: 'Zone fonctionnelle', detail: 'CrossFit & training' },
      { name: 'Salle de cours collectifs', detail: 'Planning hebdomadaire' },
      { name: 'Salle de bike', detail: 'Cardio & endurance' },
      { name: 'Terrasse extérieure', detail: '120m²' },
    ],
    capacity: '80 personnes',
    hours: '06h00 – 22h00',
  },
  {
    id: 'wellness',
    label: 'BIEN-ÊTRE',
    color: '#52ad77',
    accent: '#0d2b1a',
    image: '/images/spaces/wellness.jpg',
    headline: 'Récupérez. Équilibrez.',
    tagline: "Une parenthèse dédiée à la récupération, au relâchement et à l'équilibre global.",
    spaces: [
      { name: 'Espace détente', detail: 'Ostéopathie incluse' },
      { name: 'Massages', detail: 'Sur rendez-vous' },
      { name: 'Cupping thérapy', detail: 'Récupération profonde' },
    ],
    capacity: '20 personnes',
    hours: '08h00 – 21h00',
  },
  {
    id: 'padel',
    label: 'PADEL',
    color: '#9e4f96',
    accent: '#1a0d1a',
    image: '/images/spaces/padel.jpg',
    headline: 'Jouez. Gagnez. Revenez.',
    tagline: 'Un espace compétition et convivialité pour jouer dans des conditions premium.',
    spaces: [
      { name: '2 terrains premium', detail: 'Normes FIP · Éclairage LED' },
      { name: 'Restauration', detail: 'Bar & snacks sur place' },
    ],
    capacity: '8 joueurs / terrain',
    hours: '07h00 – 23h00',
  },
];

export default function LesEspacesPage() {
  return (
    <div className="min-h-screen bg-[#1d1d1b]">
      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
                Nos espaces
              </p>
              <h1 className="text-hero text-white leading-[0.95]">
                Un lieu,<br />
                <span className="text-white/30">trois univers.</span>
              </h1>
            </div>
            <div>
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Un lieu pensé comme un parcours : zones d'entraînement, espaces bien-être
                et expérience padel haut de gamme dans un environnement épuré.
              </p>
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 mt-8 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
              >
                Réserver maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Universe blocks */}
      <div className="space-y-2">
        {universes.map((universe, index) => (
          <section key={universe.id} className="relative">
            {/* Full-width image with overlay */}
            <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden">
              <Image
                src={universe.image}
                alt={universe.headline}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, rgba(29,29,27,0.97) 40%, rgba(29,29,27,0.4) 100%)`,
                }}
              />

              {/* Overlay content */}
              <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto w-full">
                  <div className="max-w-lg">
                    <span
                      className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-5 px-3 py-1.5 rounded-full"
                      style={{
                        color: universe.color,
                        backgroundColor: `${universe.color}18`,
                        border: `1px solid ${universe.color}30`,
                      }}
                    >
                      {universe.label}
                    </span>
                    <h2 className="text-section text-white mb-4 leading-tight">
                      {universe.headline}
                    </h2>
                    <p className="text-white/60 text-base leading-relaxed">
                      {universe.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details strip */}
            <div className="bg-[#141414] px-6 md:px-12 lg:px-20 py-10">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {/* Spaces list */}
                  <div className="md:col-span-2">
                    <p
                      className="text-xs font-bold tracking-[0.25em] uppercase mb-6"
                      style={{ color: universe.color }}
                    >
                      Ce que vous trouverez
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {universe.spaces.map((space) => (
                        <li key={space.name} className="flex items-start gap-3">
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: universe.color }}
                          />
                          <div>
                            <span className="text-white font-medium text-sm">{space.name}</span>
                            <span className="block text-white/40 text-xs mt-0.5">{space.detail}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick info */}
                  <div className="flex flex-col gap-5 justify-center">
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Capacité</p>
                        <p className="text-white text-sm font-semibold">{universe.capacity}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Horaires</p>
                        <p className="text-white text-sm font-semibold">{universe.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="border border-white/10 rounded-[var(--radius-lg)] p-12 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-white text-3xl font-bold mb-3">Prêt à commencer ?</h2>
              <p className="text-white/50 text-base">Réservez votre première session ou prenez contact avec notre équipe.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
              >
                Réserver
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 font-medium text-base rounded-[var(--radius-md)] hover:bg-white/10 transition-colors cursor-pointer"
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
