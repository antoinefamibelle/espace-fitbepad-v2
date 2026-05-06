'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const courtFeatures = [
  {
    title: 'Normes FIP',
    description:
      'Dimensions et surface conformes aux standards de la Fédération Internationale de Padel. Le même terrain que les pros.',
  },
  {
    title: 'Éclairage LED professionnel',
    description:
      "Intensité calibrée pour supprimer les zones d'ombre. Jouez en soirée avec la même précision qu'à midi.",
  },
  {
    title: "Ouvert 7j/7 jusqu'à 23h",
    description:
      "Réservez en ligne à tout moment. Votre créneau est confirmé instantanément, sans file d'attente.",
  },
  {
    title: 'Bar & restauration sur place',
    description:
      "Prenez de l'énergie avant de jouer, récupérez après. Un espace convivial qui prolonge l'expérience.",
  },
];

const steps = [
  {
    number: '01',
    title: 'Choisissez votre créneau',
    description:
      "Consultez les disponibilités en temps réel. Réservez seul ou à plusieurs en moins d'une minute.",
  },
  {
    number: '02',
    title: 'Composez votre équipe',
    description:
      "Invitez jusqu'à 3 joueurs. Débutant ou confirmé — chaque niveau est le bienvenu sur nos courts.",
  },
  {
    number: '03',
    title: 'Arrivez. Jouez.',
    description:
      'Présentez-vous 10 minutes avant. Vestiaires, raquettes et balles disponibles sur place.',
  },
];

const practicalInfo = [
  { label: 'Horaires', value: '07h00 – 23h00, 7j/7' },
  { label: 'Joueurs par terrain', value: '4 (format 2 contre 2)' },
  { label: 'Matériel', value: 'Raquettes et balles disponibles en location' },
  { label: 'Vestiaires', value: 'Douches et casiers sécurisés inclus' },
  { label: 'Restauration', value: 'Bar et snacks sur place' },
  { label: 'Niveau requis', value: 'Aucun — tous niveaux acceptés' },
];

const stats = [
  { value: '2', label: 'Terrains premium' },
  { value: 'FIP', label: 'Norme officielle' },
  { value: '07h–23h', label: 'Disponibles' },
  { value: '7j/7', label: 'Sans exception' },
];

export default function PadelPage() {
  return (
    <div className="min-h-screen bg-[#1d1d1b]">
      {/* ─── HERO ─── */}
      <section className="relative h-screen w-full overflow-hidden py-0">
        <Image
          src="/images/padel-hero.jpg"
          alt="Terrains de padel premium — L'Espace Verberie"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1d1d1b]/55" />

        <div className="relative z-10 flex flex-col justify-center h-screen px-6 md:px-12 lg:px-20 pb-0">
          <div className="max-w-6xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-16 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>

            <p className="text-[#9e4f96] text-sm font-semibold tracking-[0.25em] uppercase mb-6">
              Padel — Verberie, Oise
            </p>

            <h1 className="text-hero text-white mb-8 leading-[0.92]">
              Deux terrains.<br />
              <span className="text-white/25">Pas de</span> compromis.
            </h1>

            <p className="text-white/65 max-w-xl text-lg leading-relaxed mb-10">
              Courts aux normes FIP, éclairage LED professionnel et une atmosphère
              qui transforme chaque match en expérience mémorable.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
              >
                Réserver un terrain
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-medium text-base rounded-[var(--radius-md)] hover:bg-white/10 transition-colors cursor-pointer"
              >
                Nous contacter
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-white/15 grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-8 px-6 ${i < stats.length - 1 ? 'border-r border-white/15' : ''}`}
              >
                <p className="text-white text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/50 text-sm tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTALLATIONS ─── */}
      <section className="bg-white py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <div>
              <p className="text-[#9e4f96] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
                Nos installations
              </p>
              <h2 className="text-section text-[#1d1d1b] mb-8">
                Des courts pensés<br />pour performer.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-12">
                Chaque détail a été étudié pour offrir une expérience de jeu irréprochable.
                Du revêtement au filet, nos terrains répondent aux exigences des compétiteurs
                comme des joueurs du dimanche.
              </p>

              <div className="space-y-8">
                {courtFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-5">
                    <div className="mt-1 w-1.5 shrink-0 bg-[#9e4f96] rounded-full" style={{ minHeight: '1.25rem' }} />
                    <div>
                      <h3 className="font-bold text-[#1d1d1b] text-base mb-1.5">{feature.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 mt-12 bg-[#1d1d1b] text-white px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-[#1d1d1b]/80 transition-colors cursor-pointer"
              >
                Réserver maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative h-[520px] lg:h-[640px] rounded-[var(--radius-lg)] overflow-hidden">
              <Image
                src="/images/spaces/padel.jpg"
                alt="Terrain de padel L'Espace — vue intérieure"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW TO BOOK ─── */}
      <section className="bg-[#1d1d1b] py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-2xl">
            <p className="text-[#9e4f96] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
              Réservation
            </p>
            <h2 className="text-section text-white">
              Votre match en<br />3 étapes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {steps.map((step) => (
              <div key={step.number} className="bg-[#1d1d1b] p-10">
                <span className="block text-white/10 text-6xl font-bold mb-8 tabular-nums font-poppins">
                  {step.number}
                </span>
                <h3 className="text-white font-bold text-xl mb-4">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1d1d1b] px-10 py-5 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
            >
              Réserver mon terrain
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PRATIQUE ─── */}
      <section className="bg-white py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <div className="relative h-[420px] rounded-[var(--radius-lg)] overflow-hidden">
              <Image
                src="/images/padel-hero.jpg"
                alt="Joueurs de padel — L'Espace"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[#9e4f96] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
                Informations pratiques
              </p>
              <h2 className="text-section text-[#1d1d1b] mb-10">
                Tout ce qu'il<br />faut savoir.
              </h2>

              <div className="space-y-0">
                {practicalInfo.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex justify-between items-start py-5 ${
                      i < practicalInfo.length - 1 ? 'border-b border-black/8' : ''
                    }`}
                  >
                    <span className="text-gray-400 text-sm w-1/3">{item.label}</span>
                    <span className="text-[#1d1d1b] font-semibold text-sm text-right w-2/3">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 mt-10 bg-[#1d1d1b] text-white px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-[#1d1d1b]/80 transition-colors cursor-pointer"
              >
                Réserver maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-[#9e4f96] py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-hero text-white mb-6 leading-[0.95]">
            Votre prochain match<br />commence ici.
          </h2>
          <p className="text-white/70 text-lg max-w-md mx-auto mb-12">
            Réservez en quelques secondes. Des créneaux disponibles dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#9e4f96] px-10 py-5 font-bold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
            >
              Réserver un terrain
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-10 py-5 font-medium text-base rounded-[var(--radius-md)] hover:bg-white/10 transition-colors cursor-pointer"
            >
              Des questions ?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
