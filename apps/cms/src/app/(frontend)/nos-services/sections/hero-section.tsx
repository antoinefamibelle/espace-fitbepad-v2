'use client';

import { motion } from 'framer-motion';
import { Users, Dumbbell, Building } from 'lucide-react';
import Image from 'next/image';
import { LuxuryHeading, LuxuryText, LuxuryCard } from '@frontend/components/luxury';

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navigationCards = [
    {
      id: 'coaches',
      title: 'Nos Coachs',
      description: 'Rencontrez notre équipe d\'experts passionnés et certifiés',
      icon: <Users className="w-8 h-8" />,
    },
    {
      id: 'activities', 
      title: 'Nos Activités',
      description: 'Découvrez nos disciplines sportives variées et premium',
      icon: <Dumbbell className="w-8 h-8" />,
    },
    {
      id: 'spaces',
      title: 'Nos Espaces',
      description: 'Visitez nos installations modernes et luxueuses',
      icon: <Building className="w-8 h-8" />,
    }
  ];

  return (
    <section className="relative min-h-[50vh] flex flex-col justify-center overflow-hidden py-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/fitness-hero.jpg"
          alt="Sports complex"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <LuxuryHeading level={1} size="xl" variant="white">
            Nos espaces
          </LuxuryHeading>
          <LuxuryText variant="lead" size="md" color="white" className="opacity-90">
            Explorez nos univers experts, activités et espaces.
          </LuxuryText>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {navigationCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => scrollToSection(card.id)}
              className="cursor-pointer"
            >
              <LuxuryCard 
                variant="glass" 
                padding="lg"
                hover={true}
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10"
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black luxury-shadow`}>
                      {card.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <LuxuryHeading 
                    level={3} 
                    size="md" 
                    variant="white"
                    align="center"
                    className="mb-3"
                  >
                    {card.title}
                  </LuxuryHeading>
                  <LuxuryText 
                    variant="body" 
                    size="sm" 
                    color="white"
                    align="center"
                    className="opacity-80 leading-relaxed"
                  >
                    {card.description}
                  </LuxuryText>
                  
                  {/* Hover indicator */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-white/40 to-white/80 rounded-full group-hover:w-12 transition-all duration-300" />
                  </div>
                </div>
              </LuxuryCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}