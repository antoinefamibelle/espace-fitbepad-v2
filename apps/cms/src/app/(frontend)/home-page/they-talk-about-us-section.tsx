'use client';

import Image from 'next/image';
import { brands } from '@frontend/data/brands';

export const TheyTalkAboutUsSection = () => {
  return (
    <section className="bg-[#1d1d1b] py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-20">
          {/* Left label */}
          <div className="shrink-0">
            <p className="text-white/30 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              Ils parlent de nous
            </p>
            <p className="text-white text-2xl font-bold max-w-[200px] leading-tight">
              Nos partenaires médias
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-white/15 shrink-0" />

          {/* Logos */}
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            {brands.map((brand) => {
              const content = (
                <div
                  key={brand.name}
                  className="relative w-28 h-12 md:w-36 md:h-14 opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale invert"
                >
                  <Image
                    src={brand.logo}
                    alt={brand.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              );

              if (brand.website) {
                return (
                  <a
                    key={brand.name}
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visiter ${brand.name}`}
                  >
                    {content}
                  </a>
                );
              }

              return content;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
