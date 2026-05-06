'use client';

import { motion } from 'framer-motion';
import { Card } from '@frontend/components/ui/card';
import { Users } from 'lucide-react';
import { coaches } from '@frontend/data/services-page';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function CoachesSection() {
  return (
    <section id="coaches" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Coachs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une équipe passionnée et qualifiée pour vous accompagner dans l'atteinte de vos objectifs
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.name}
              variants={itemVariants as any}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
            >
              <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl py-0">
                {/* Coach Image */}
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <Image
                    src={coach.imageUrl}
                    alt={coach.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                
                {/* Coach Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {coach.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-primary font-semibold">
                      {coach.specialty}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}