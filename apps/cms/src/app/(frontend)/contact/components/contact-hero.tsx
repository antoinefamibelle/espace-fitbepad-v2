'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ContactHero() {
  return (
    <div className="bg-[#1d1d1b] px-6 md:px-12 lg:px-20 pt-12 pb-20">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-5">
          Parlons de votre objectif
        </p>

        <h1 className="text-hero text-white max-w-4xl leading-[0.95]">
          Démarrez votre<br />
          <span className="text-white/40">parcours avec</span> nous.
        </h1>
      </div>
    </div>
  );
}
