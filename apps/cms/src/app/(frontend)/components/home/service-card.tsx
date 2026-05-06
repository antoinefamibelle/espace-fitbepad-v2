'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ServiceCardProps } from '@frontend/types/service';
import { LuxuryHeading, LuxuryText, LuxuryButton } from '@frontend/components/luxury';
import { cn } from '@frontend/lib/utils';

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  return (
    <div
      className="group relative overflow-hidden rounded-[var(--radius-lg)] animate-fade-in"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-[550px] flex flex-col justify-between">
        {/* Icon */}
        <div className="self-start">
          <div className="w-16 h-16 bg-white/95 border border-white/80 rounded-[var(--radius-md)] flex items-center justify-center mb-8">
            <service.icon className={
              cn('w-8 h-8 text-luxury-black',{
                'text-luxury-black': service.type === 'fitness',
                'text-luxury-green': service.type === 'wellness',
                'text-luxury-purple': service.type === 'padel'
              })
            } />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <LuxuryHeading 
            level={3} 
            size="md" 
            variant="white"
            className="font-heading"
          >
            {service.title}
          </LuxuryHeading>
          
          <LuxuryText 
            variant="lead" 
            size="lg" 
            color={service.type as 'fitness' | 'wellness' | 'padel'}
            className="font-medium"
          >
            {service.subtitle}
          </LuxuryText>
          
          <LuxuryText 
            variant="body" 
            size="md" 
            color="white"
            className="opacity-90 line-clamp-3 mb-6"
          >
            {service.description}
          </LuxuryText>
          
          <LuxuryButton 
            variant={service.type as 'primary' | 'secondary' | 'accent' | 'ghost' | 'fitness' | 'wellness' | 'padel'}
            className="hover:text-luxury-black hover:bg-luxury-white"
            size="md"
          >
            En savoir plus
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </LuxuryButton>
        </div>
      </div>
    </div>
  );
};
