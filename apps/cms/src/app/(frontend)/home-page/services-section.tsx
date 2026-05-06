'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const services = [
  {
    id: 'fitness',
    label: 'FITNESS',
    title: 'Repoussez vos limites',
    description: 'Salle de 400m² équipée Technogym, zone fonctionnelle et cours collectifs pour tous les niveaux.',
    image: '/images/spaces/fitness.webp',
    href: '/nos-services/fitness',
    accent: '#ffffff',
    span: 'col-span-1 md:col-span-2 row-span-2',
    imageHeight: 'h-[480px] md:h-full min-h-[480px]',
  },
  {
    id: 'wellness',
    label: 'BIEN-ÊTRE',
    title: 'Récupérez et équilibrez',
    description: 'Ostéopathie, massage et soins pour votre équilibre quotidien.',
    image: '/images/spaces/wellness.jpg',
    href: '/nos-services/bien-etre',
    accent: '#52ad77',
    span: 'col-span-1',
    imageHeight: 'h-[280px]',
  },
  {
    id: 'padel',
    label: 'PADEL',
    title: 'Jouez au plus haut niveau',
    description: 'Deux terrains FIP avec éclairage LED et restauration sur place.',
    image: '/images/spaces/padel.jpg',
    href: '/nos-services/padel',
    accent: '#9e4f96',
    span: 'col-span-1',
    imageHeight: 'h-[280px]',
  },
];

export const ServicesSection = () => {
  return (
    <section className="bg-[#1d1d1b] py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-[#52ad77] text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              Nos univers
            </p>
            <h2 className="text-section text-white">
              Trois mondes,<br />un seul lieu.
            </h2>
          </div>
          <Link
            href="/nos-services/les-espaces"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors group shrink-0"
          >
            Voir tous les espaces
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto md:grid-rows-2 gap-4 md:h-[640px]">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className={`group relative overflow-hidden rounded-[var(--radius-lg)] bg-[#111] ${service.span} block`}
            >
              <div className={`relative w-full ${service.imageHeight}`}>
                <Image
                  src={service.image}
                  alt={service.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <span
                  className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
                  style={{ color: service.accent }}
                >
                  {service.label}
                </span>
                <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                  {service.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed hidden md:block">
                  {service.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                  En savoir plus
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
