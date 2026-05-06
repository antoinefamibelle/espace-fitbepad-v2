'use client';

import { motion } from 'framer-motion';
import { Card } from '@frontend/components/ui/card';
import { Button } from '@frontend/components/ui/button';
import { ExternalLink, Clock, Users, MapPin, Phone } from 'lucide-react';
import { GymClass, gymClasses } from '@frontend/data/gym-class';

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] as const;

const getCategoryStyle = (category?: GymClass['category']) => {
  switch (category) {
    case 'Morning':
      return 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200 text-amber-900 shadow-amber-200/50';
    case 'Midday':
      return 'bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200 text-blue-900 shadow-blue-200/50';
    case 'Evening':
      return 'bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200 text-purple-900 shadow-purple-200/50';
    case 'Seniors':
      return 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 text-yellow-900 shadow-yellow-300/60 ring-2 ring-yellow-300/30';
    default:
      return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 text-gray-900 shadow-gray-200/50';
  }
};

const getCategoryIcon = (category?: GymClass['category']) => {
  switch (category) {
    case 'Seniors':
      return <Users className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};

export function Schedule() {
  const classesByDay = days.reduce((acc, day) => {
    acc[day] = gymClasses.filter(cls => cls.day === day);
    return acc;
  }, {} as Record<string, GymClass[]>);

  return (
    <motion.section 
      className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planning des Cours
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Creez votre propre rythme et vivez l’experience l’Espace
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { category: 'Morning', label: 'Matin', color: 'from-amber-100 to-orange-100' },
            { category: 'Midday', label: 'Midi', color: 'from-blue-100 to-cyan-100' },
            { category: 'Evening', label: 'Soir', color: 'from-purple-100 to-indigo-100' },
            { category: 'Seniors', label: 'Seniors', color: 'from-yellow-100 to-yellow-200' },
          ].map(({ category, label, color }) => (
            <div key={category} className="flex items-center gap-2 text-sm text-gray-600">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${color} border border-gray-200`}></div>
              {label}
            </div>
          ))}
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 gap-6">
            {days.map((day, dayIndex) => (
              <motion.div
                key={day}
                className="space-y-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * dayIndex }}
              >
                {/* Day Header */}
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900">{day}</h3>
                </div>
                
                {/* Classes */}
                <div className="space-y-3 min-h-[400px]">
                  {classesByDay[day].map((cls, index) => (
                    <motion.div
                      key={`${cls.day}-${cls.time}-${index}`}
                      whileHover={{ 
                        scale: 1.03,
                        y: -2,
                        transition: { type: "spring" as const, stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${getCategoryStyle(cls.category)}`}>
                        <div className="space-y-2">
                          {/* Time and Duration */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold flex items-center gap-1">
                              {getCategoryIcon(cls.category)}
                              {cls.time}
                            </span>
                            <span className="text-xs opacity-75 bg-white/40 px-2 py-1 rounded-full">
                              {cls.duration}
                            </span>
                          </div>
                          
                          {/* Class Name */}
                          <h4 className="font-bold text-sm leading-tight">
                            {cls.name}
                          </h4>
                          
                          {/* Seniors Badge */}
                          {cls.category === 'Seniors' && (
                            <div className="inline-block">
                              <span className="text-xs bg-yellow-300/60 text-yellow-900 px-2 py-1 rounded-full font-medium">
                                ✨ Spécial Seniors
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {days.map((day, dayIndex) => (
              <motion.div
                key={day}
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * dayIndex }}
              >
                {/* Day Header */}
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-bold text-xl text-gray-900">{day}</h3>
                </div>
                
                {/* Classes */}
                <div className="space-y-3">
                  {classesByDay[day].map((cls, index) => (
                    <motion.div
                      key={`${cls.day}-${cls.time}-${index}`}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { type: "spring" as const, stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className={`p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${getCategoryStyle(cls.category)}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-semibold flex items-center gap-2">
                            {getCategoryIcon(cls.category)}
                            {cls.time}
                          </span>
                          <span className="text-sm opacity-75 bg-white/40 px-3 py-1 rounded-full">
                            {cls.duration}
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-base mb-2">
                          {cls.name}
                        </h4>
                        
                        {cls.category === 'Seniors' && (
                          <span className="text-sm bg-yellow-300/60 text-yellow-900 px-3 py-1 rounded-full font-medium">
                            ✨ Spécial Seniors
                          </span>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                  
                  {classesByDay[day].length === 0 && (
                    <Card className="p-6 text-center text-gray-500 border-dashed">
                      <p className="text-sm">Aucun cours programmé</p>
                    </Card>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Information */}
          {/* Contact Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl mt-4"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Phone Number */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-900 p-3 rounded-2xl shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                Téléphone
              </h3>
              <a 
                href="tel:0344834729" 
                className="text-lg text-gray-600 hover:text-gray-900 transition-colors"
              >
                03 44 83 47 29
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="bg-gray-900 p-3 rounded-2xl shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                Adresse
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                24 route de saint sauveur<br />
                60 - Verberie
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </motion.section>
  );
}