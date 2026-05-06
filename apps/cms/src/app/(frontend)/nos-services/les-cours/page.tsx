'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Dumbbell, Sparkles, Trophy, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Course } from '@frontend/data/courses';

const UNIVERS_COLORS = {
  fitness: '#333333',
  wellness: '#50ae77',
  padel: '#9e4f96',
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Fitness':
      return Dumbbell;
    case 'Bien-être':
      return Sparkles;
    case 'Padel':
      return Trophy;
    default:
      return Calendar;
  }
};

const activitySections = [
  {
    id: 'fitness',
    title: 'Nos cours fitness',
    color: UNIVERS_COLORS.fitness,
    match: (course: Course) => {
      const category = course.category.toLowerCase();
      return category.includes('fitness') || category.includes('force');
    },
  },
  {
    id: 'wellness',
    title: 'Nos activités bien-être',
    color: UNIVERS_COLORS.wellness,
    match: (course: Course) => course.category.toLowerCase().includes('bien'),
  },
  {
    id: 'padel',
    title: 'Nos offres padel',
    color: UNIVERS_COLORS.padel,
    match: (course: Course) => course.category.toLowerCase().includes('padel'),
  },
] as const;

export default function LeCoursPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      try {
        const response = await fetch('/api/site/courses', { cache: 'no-store' });
        const payload = await response.json();
        if (!isMounted || !payload?.success || !Array.isArray(payload.courses)) return;
        setCourses(payload.courses);
      } catch (error) {
        console.error('Unable to load site courses', error);
      }
    }

    loadCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl"
          >
            <h1 className="font-noka font-bold text-hero mb-8 text-luxury-black">
              Nos activités
            </h1>
            <p className="text-subhead text-gray-600 max-w-3xl leading-relaxed">
              Une programmation claire et efficace, pensee pour progresser sur la duree en fitness, bien-etre et padel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Activities sections */}
      <section className="pb-12 space-y-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {activitySections.map((section) => {
            const sectionCourses = courses.filter(section.match);

            return (
              <div key={section.id} className="mb-24 last:mb-0">
                <h2 className="mb-10 text-section font-bold" style={{ color: section.color }}>
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {sectionCourses.map((course, index) => (
                    <motion.div
                      key={`${section.id}-${course.id}`}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.05 }}
                      className="group"
                    >
                      <article className="bg-white rounded-[var(--radius-lg)] overflow-hidden h-full flex flex-col border border-black/10">
                        <div className="relative h-72 overflow-hidden">
                          <div className="absolute inset-0 opacity-25 z-10" style={{ backgroundColor: section.color }} />
                          <Image
                            src={course.image || '/images/fitness-hero.jpg'}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />

                          <div className="absolute top-4 left-4">
                            <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 border border-black/10">
                              {(() => {
                                const CategoryIcon = getCategoryIcon(course.category);
                                return <CategoryIcon className="h-4 w-4" style={{ color: section.color }} />;
                              })()}
                              <span className="text-sm font-medium text-luxury-black">{course.category}</span>
                            </div>
                          </div>

                          <div className="absolute top-4 right-4">
                            <div className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-white/95" style={{ borderColor: `${section.color}55`, color: section.color }}>
                              {course.difficulty}
                            </div>
                          </div>

                          <div className="absolute bottom-4 right-4">
                            <div className="backdrop-blur-sm text-white rounded-full px-4 py-2" style={{ backgroundColor: '#000000cc' }}>
                              <span className="font-bold text-lg">{course.price}€</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="font-noka font-bold text-headline text-luxury-black mb-3">{course.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.description}</p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-xs text-gray-700">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-4 h-4" style={{ color: section.color }} />
                                {course.duration}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Users className="w-4 h-4" style={{ color: section.color }} />
                                {course.maxParticipants} max
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" style={{ color: section.color }} />
                                Niveau {course.difficulty}
                              </span>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-noka font-semibold text-sm text-luxury-black mb-2">Benefices</h4>
                              <div className="space-y-1">
                                {course.benefits.slice(0, 3).map((benefit, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: section.color }} />
                                    <span className="text-xs text-gray-600">{benefit}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            className="w-full mt-5 bg-white text-black border border-black py-3 rounded-[var(--radius-md)] font-medium hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
                            type="button"
                          >
                            Réserver ce cours
                          </button>
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

      {/* Info Section */}
      <section className="py-12 bg-[#fafafa]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-[var(--radius-lg)] p-8 border border-black/10 h-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${UNIVERS_COLORS.wellness}1f` }}>
                  <Calendar className="w-8 h-8" style={{ color: UNIVERS_COLORS.wellness }} />
                </div>
                <h3 className="font-noka font-bold text-headline text-luxury-black mb-3">
                  Reservation flexible
                </h3>
                <p className="text-gray-600">
                  Reservez ou annulez vos cours facilement jusqu a 2h avant le debut
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-[var(--radius-lg)] p-8 border border-black/10 h-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${UNIVERS_COLORS.fitness}14` }}>
                  <Users className="w-8 h-8" style={{ color: UNIVERS_COLORS.fitness }} />
                </div>
                <h3 className="font-noka font-bold text-headline text-luxury-black mb-3">
                  Petits groupes
                </h3>
                <p className="text-gray-600">
                  Des cours en petits effectifs pour un accompagnement personnalisé
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-[var(--radius-lg)] p-8 border border-black/10 h-full">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${UNIVERS_COLORS.padel}1f` }}>
                  <CheckCircle className="w-8 h-8" style={{ color: UNIVERS_COLORS.padel }} />
                </div>
                <h3 className="font-noka font-bold text-headline text-luxury-black mb-3">
                  Coachs experts
                </h3>
                <p className="text-gray-600">
                  Tous nos coachs sont certifiés et passionnés par leur discipline
                </p>
              </div>
            </motion.div>
          </div>
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
              Trouvez votre cours idéal
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Découvrez notre planning complet et réservez votre place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-white text-black border border-white px-8 py-4 rounded-[var(--radius-md)] font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
                type="button"
              >
                Voir le planning
              </button>
              <button
                className="border-2 border-white text-white px-8 py-4 rounded-[var(--radius-md)] font-semibold text-lg hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
                type="button"
              >
                Essai gratuit
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}