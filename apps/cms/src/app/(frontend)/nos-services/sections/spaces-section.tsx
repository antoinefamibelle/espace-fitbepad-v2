'use client';

import { motion } from 'framer-motion';
import { Card } from '@frontend/components/ui/card';
import { MapPin } from 'lucide-react';
import { spaces } from '@frontend/data/services-page';
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

export function SpacesSection() {
  return (
    <section id="spaces" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Espaces
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des installations modernes et équipées pour votre confort et vos performances
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {spaces.map((space, index) => (
            <motion.div
              key={space.title}
              variants={itemVariants as any}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
            >
              <Card className="overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl py-0">
                {/* Space Image */}
                <div className="relative h-72 overflow-hidden group">
                  <Image
                    src={space.imageUrl}
                    alt={space.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm font-medium">Espace Sports</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {space.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      {space.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}