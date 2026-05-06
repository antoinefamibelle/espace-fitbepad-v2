'use client';

import { motion } from 'framer-motion';
import { Card } from '@frontend/components/ui/card';
import { activities } from '@frontend/data/services-page';
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

export function ActivitiesSection() {
  return (
    <section id="activities" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Activités
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des disciplines variées pour tous les goûts et tous les niveaux
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              variants={itemVariants as any}
              whileHover={{ y: -8 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
            >
              <Card className="text-center p-8 h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500">
                {/* Activity Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center">
                    <activity.iconUrl />
                  </div>
                </div>
                
                {/* Activity Info */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {activity.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {activity.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}