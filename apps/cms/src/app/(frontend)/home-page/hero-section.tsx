'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Dumbbell, Leaf, Zap } from 'lucide-react';

const stats = [
  { value: '7J/7', label: 'Ouvert' },
  { value: '400m²', label: 'de fitness' },
  { value: '2', label: 'terrains padel' },
  { value: '3', label: 'univers' },
];

export const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#1d1d1b]">
      <Image
        src="/images/hero-gym.jpg"
        alt="L'Espace — fitness, bien-être et padel à Verberie"
        fill
        className="object-cover opacity-50"
        priority
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-20 pb-0">
        <div className="max-w-5xl">
          <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-6">
            Verberie — Oise
          </p>

          <h1 className="text-hero text-white mb-8 leading-[0.92]">
            Votre espace<br />
            <span className="text-[#52ad77]">fitness,</span> bien-être<br />
            &amp; padel.
          </h1>

          <p className="text-white/70 max-w-xl text-lg leading-relaxed mb-10">
            Un lieu pensé comme un parcours : équipements haut de gamme,
            coachs experts et trois univers complémentaires sous un même toit.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 bg-white text-[#1d1d1b] px-8 py-4 font-semibold text-base rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
            >
              Réserver maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/nos-services/les-espaces"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-medium text-base rounded-[var(--radius-md)] hover:bg-white/10 transition-colors cursor-pointer"
            >
              Découvrir les espaces
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
  );
};
