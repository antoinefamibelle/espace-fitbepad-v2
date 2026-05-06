'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Award, Quote } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Coach } from '@frontend/data/coaches';

const UNIVERS_COLORS = {
  fitness: '#333333',
  wellness: '#50ae77',
  padel: '#9e4f96',
};

interface CoachSection {
  id: 'fitness' | 'wellness' | 'padel';
  title: string;
  color: string;
}

const coachSections: CoachSection[] = [
  {
    id: 'fitness',
    title: 'Nos experts fitness',
    color: UNIVERS_COLORS.fitness,
  },
  {
    id: 'wellness',
    title: 'Nos experts bien-être',
    color: UNIVERS_COLORS.wellness,
  },
  {
    id: 'padel',
    title: 'Nos experts padel',
    color: UNIVERS_COLORS.padel,
  },
];

export default function LesCoachPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadCoaches() {
      try {
        const response = await fetch('/api/site/coaches', { cache: 'no-store' });
        const payload = await response.json();
        if (!isMounted || !payload?.success || !Array.isArray(payload.coaches)) return;
        setCoaches(payload.coaches);
      } catch (error) {
        console.error('Unable to load site coaches', error);
      }
    }

    loadCoaches();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-12 pb-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <h1 className="font-noka font-bold text-hero mb-8 text-luxury-black">
              Nos experts
            </h1>
            <p className="text-subhead text-gray-600 max-w-3xl leading-relaxed">
              Rencontrez les coachs qui accompagnent chaque progression avec exigence, bienveillance et methodes concretes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coach sections */}
      <section className="pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {coachSections.map((section) => {
            const sectionCoaches = coaches.filter((coach) => coach.category === section.id);
            return (
              <div key={section.id} className="mb-24 last:mb-0">
                <h2 className="mb-10 text-section font-bold" style={{ color: section.color }}>
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {sectionCoaches.map((coach, index) => (
                    <motion.div
                      key={`${section.id}-${coach.id}`}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
                      className={`group cursor-pointer ${index === 0 ? 'lg:col-span-2' : ''}`}
                    >
                      <article className="overflow-hidden border border-black/10 bg-white rounded-[var(--radius-lg)]">
                        <div className={`grid ${index === 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-2'}`}>
                          <div className={`relative min-h-[420px] ${index === 0 ? 'lg:col-span-3' : ''}`}>
                            <div className="absolute inset-0 opacity-25 z-10" style={{ backgroundColor: section.color }} />
                            <Image
                              src={coach.image}
                              alt={coach.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-black/55">
                              <h3 className="font-noka font-bold text-3xl text-white mb-1">{coach.name}</h3>
                              <p className="text-white/85">{coach.title}</p>
                            </div>
                          </div>

                          <div className={`p-7 lg:p-8 flex flex-col ${index === 0 ? 'lg:col-span-2' : ''}`}>
                            <div className="rounded-[var(--radius-md)] p-5 mb-6" style={{ backgroundColor: `${section.color}14` }}>
                              <div className="flex items-start gap-3">
                                <Quote className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: section.color }} />
                                <p className="text-gray-700 italic leading-relaxed text-sm">"{coach.quote}"</p>
                              </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-6 text-sm">{coach.bio}</p>

                            <div className="mb-6">
                              <h4 className="font-noka font-semibold text-luxury-black mb-3 flex items-center gap-2 text-sm">
                                <Award className="w-4 h-4" style={{ color: section.color }} />
                                Specialites
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {coach.specialties.map((specialty, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: `${section.color}1f`, color: section.color }}
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2 mb-8">
                              {coach.certifications.slice(0, 3).map((cert, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: section.color }} />
                                  <span className="text-gray-600 text-sm">{cert}</span>
                                </div>
                              ))}
                            </div>

                            <button
                              className="mt-auto inline-flex items-center gap-2 border border-black px-5 py-3 rounded-[var(--radius-md)] text-sm font-semibold text-black hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
                              type="button"
                            >
                              Reserver avec ce coach
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-noka font-bold text-section text-white mb-6">
              Pret.e a vous lancer ?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Reservez votre seance avec l un de nos experts.
            </p>
            <button
              className="bg-white text-black border border-white px-8 py-4 rounded-[var(--radius-md)] font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
              type="button"
            >
              Je me lance
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}