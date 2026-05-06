'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const services = [
  {
    tag: 'Ostéopathie',
    headline: "Le corps rééquilibré de l'intérieur.",
    description:
      "Nos ostéopathes traitent les tensions musculo-squelettiques à leur source. Douleurs chroniques, récupération sportive, stress — chaque séance est un bilan complet.",
    detail: 'Sur rendez-vous · 45 à 60 min',
    image: '/images/spaces/wellness.jpg',
  },
  {
    tag: 'Massages thérapeutiques',
    headline: 'La récupération comme méthode.',
    description:
      'Massage sportif deep tissue, relaxation suédoise ou drainage lymphatique. Pratiqués par des thérapeutes formés, pour des résultats mesurables — pas juste du confort.',
    detail: 'Sur rendez-vous · 30, 60 ou 90 min',
    image: '/images/wellness-hero.jpg',
  },
  {
    tag: 'Cupping thérapy',
    headline: 'La ventouse qui libère en profondeur.',
    description:
      'Technique ancestrale modernisée. Les ventouses créent une dépression dans les tissus pour libérer les noeuds, activer la circulation et accélérer la récupération musculaire.',
    detail: 'Sur rendez-vous · 30 à 45 min',
    image: '/images/spaces/wellness.jpg',
  },
];

const stats = [
  { value: '3', label: 'Disciplines bien-être' },
  { value: '08h–21h', label: 'Disponibles' },
  { value: '7j/7', label: 'Sur rendez-vous' },
  { value: 'Expert', label: 'Praticiens certifiés' },
];

const philosophy = [
  {
    number: '01',
    title: "La récupération n'est pas un luxe",
    description:
      "C'est une discipline à part entière. Les meilleurs athlètes y consacrent autant de temps qu'à l'entraînement. Chez nous, c'est pensé comme tel.",
  },
  {
    number: '02',
    title: 'Des praticiens, pas des prestataires',
    description:
      'Chaque intervenant est diplômé et pratique dans une approche thérapeutique — pas esthétique. Vous venez pour des résultats, vous repartez avec.',
  },
  {
    number: '03',
    title: 'Un espace conçu pour le relâchement',
    description:
      'Lumière, acoustique, température — tout est calibré. Parce que la récupération commence avant même la séance.',
  },
];

export default function BienEtrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO ─── */}
      <section className="relative h-screen w-full overflow-hidden py-0 bg-[#1d1d1b]">
        <Image
          src="/images/wellness-hero.jpg"
          alt="Espace bien-être — L'Espace Verberie"
          fill
          className="object-cover opacity-50"
          priority
        />

        <div className="relative z-10 flex flex-col justify-center h-screen px-6 md:px-12 lg:px-20 pb-0">
          <div className="max-w-6xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-16 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Accueil
            </Link>

            <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-6">
              Bien-être — Verberie, Oise
            </p>

            <h1 className="text-hero text-white mb-8 leading-[0.92]">
              Votre corps<br />
              mérite <span className="text-[#52ad77]">mieux.</span>
            </h1>

            <p className="text-white/65 max-w-xl text-lg leading-relaxed mb-10">
              Ostéopathie, massage thérapeutique et cupping. Des praticiens certifiés
              dans un espace pensé pour la vraie récupération — pas le folklore.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
              >
                Prendre rendez-vous
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

      {/* ─── SERVICES ─── */}
      <section className="bg-white py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-2xl">
            <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
              Nos soins
            </p>
            <h2 className="text-section text-[#1d1d1b]">
              Trois pratiques.<br />Un seul résultat.
            </h2>
          </div>

          <div className="space-y-2">
            {services.map((service, i) => (
              <div
                key={service.tag}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[var(--radius-lg)]"
              >
                {/* Image */}
                <div className={`relative h-[340px] lg:h-[460px] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Image
                    src={service.image}
                    alt={service.tag}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div
                  className={`bg-[#f8f8f8] flex flex-col justify-center p-10 lg:p-16 ${
                    i % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-[#52ad77] mb-6">
                    {service.tag}
                  </span>
                  <h3 className="text-headline text-[#1d1d1b] mb-5">{service.headline}</h3>
                  <p className="text-gray-500 text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <p className="text-[#1d1d1b]/40 text-sm font-medium mb-10">{service.detail}</p>
                  <Link
                    href="/reservation"
                    className="inline-flex items-center gap-2 bg-[#1d1d1b] text-white px-7 py-3.5 font-semibold text-sm rounded-[var(--radius-md)] hover:bg-[#1d1d1b]/80 transition-colors cursor-pointer self-start"
                  >
                    Prendre rendez-vous
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHILOSOPHY ─── */}
      <section className="bg-[#1d1d1b] py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-2xl">
            <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
              Notre approche
            </p>
            <h2 className="text-section text-white">
              Le repos est<br />une discipline.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {philosophy.map((item) => (
              <div
                key={item.number}
                className="bg-[#1d1d1b] p-10 group hover:bg-[#111] transition-colors duration-300"
              >
                <span className="block text-white/10 text-5xl font-bold mb-8 tabular-nums group-hover:text-white/[0.08] transition-colors">
                  {item.number}
                </span>
                <h3 className="text-white font-bold text-lg mb-4">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FULL-WIDTH IMAGE ─── */}
      <section className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden py-0">
        <Image
          src="/images/spaces/wellness.jpg"
          alt="Espace bien-être L'Espace — ambiance"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1d1d1b]/45" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-section text-white max-w-lg">
              Un espace pensé pour vous permettre de vraiment récupérer.
            </h2>
          </div>
        </div>
      </section>

      {/* ─── PRATIQUE ─── */}
      <section className="bg-white py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <div>
              <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
                Informations pratiques
              </p>
              <h2 className="text-section text-[#1d1d1b] mb-10">
                Votre première<br />séance, simplement.
              </h2>

              <div className="space-y-0 mb-12">
                {[
                  { label: 'Horaires', value: '08h00 – 21h00, 7j/7' },
                  { label: 'Durée des séances', value: '30, 45, 60 ou 90 min selon le soin' },
                  { label: 'Rendez-vous', value: 'En ligne ou par téléphone' },
                  { label: 'Praticiens', value: "Diplômés d'État, certifiés" },
                  { label: 'Vestiaires', value: 'Disponibles avant et après la séance' },
                ].map((item, i, arr) => (
                  <div
                    key={item.label}
                    className={`flex justify-between items-start py-5 ${
                      i < arr.length - 1 ? 'border-b border-black/[0.08]' : ''
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
                className="inline-flex items-center gap-2 bg-[#1d1d1b] text-white px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-[#1d1d1b]/80 transition-colors cursor-pointer"
              >
                Prendre rendez-vous
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pull quote */}
            <div className="border-l-2 border-[#52ad77] pl-10">
              <blockquote className="text-2xl text-[#1d1d1b] font-light leading-relaxed mb-8">
                &ldquo;La récupération n&rsquo;est pas la fin de l&rsquo;effort — c&rsquo;est la condition de sa continuité.&rdquo;
              </blockquote>
              <p className="text-[#52ad77] text-sm font-semibold tracking-[0.2em] uppercase">
                L&rsquo;Espace Bien-être
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-[#52ad77] py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-hero text-white mb-6 leading-[0.95]">
            Votre prochain<br />rendez-vous.
          </h2>
          <p className="text-white/70 text-lg max-w-md mx-auto mb-12">
            Réservez en quelques secondes. Des créneaux disponibles dès aujourd&rsquo;hui,
            avec les praticiens qui font la différence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#52ad77] px-10 py-5 font-bold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
            >
              Prendre rendez-vous
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-10 py-5 font-medium text-base rounded-[var(--radius-md)] hover:bg-white/10 transition-colors cursor-pointer"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
