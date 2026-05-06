'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface NavigationCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement<LucideIcon>;
  gradient: string;
  href: string;
  delay?: number;
}

export function NavigationCard({
  id,
  title,
  description,
  icon,
  gradient,
  href,
  delay = 0
}: NavigationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="cursor-pointer group"
    >
      <Link href={href}>
        <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white">
          <div className="text-center">
            {/* Icon */}
            <div className="mb-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
            </div>
            
            {/* Content */}
            <h3 className="font-noka font-semibold text-lg text-luxury-black mb-2 group-hover:text-luxury-green transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
            
            {/* Hover indicator */}
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-0.5 bg-gradient-to-r from-luxury-green/40 to-luxury-green/80 rounded-full group-hover:w-10 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}