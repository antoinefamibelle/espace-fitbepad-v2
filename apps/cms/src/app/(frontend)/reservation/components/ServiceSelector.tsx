'use client';

import React from 'react';
import { Skeleton } from '@frontend/components/ui/skeleton';
import { Clock, AlertCircle, Check, Dumbbell } from 'lucide-react';
import { cn } from '@frontend/lib/utils';
import { useBookingServices } from '@frontend/lib/hooks/use-booking-data';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  slug?: string;
  priceCents: number;
  durationMins: number;
  description?: string;
  picture?: string;
  isActive?: boolean;
}

interface ServiceSelectorProps {
  selectedService?: Service;
  onServiceSelect: (service: Service) => void;
}

export function ServiceSelector({ selectedService, onServiceSelect }: ServiceSelectorProps) {
  const { data: services, isLoading, error } = useBookingServices();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-noka text-xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-2xl">
            Choisissez votre service
          </h2>
          <p className="mt-1 text-sm text-black/40">Chargement des services...</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[var(--radius-lg)] border border-black/8">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !services?.length) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-black/8 text-center">
        <AlertCircle className="h-8 w-8 text-black/20" />
        <div>
          <p className="font-semibold text-[#1d1d1b]">Service indisponible</p>
          <p className="mt-0.5 text-sm text-black/40">
            {error ? 'Erreur lors du chargement des services.' : 'Aucun service disponible pour le moment.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-noka text-xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-2xl">
          Choisissez votre service
        </h2>
        <p className="mt-1 text-sm text-black/40">
          Sélectionnez le service adapté à votre objectif.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onServiceSelect(service)}
              className={cn(
                'group relative overflow-hidden rounded-[var(--radius-lg)] border text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1d1b] focus-visible:ring-offset-2 cursor-pointer',
                isSelected
                  ? 'border-2 border-[#1d1d1b]'
                  : 'border border-black/10 hover:border-black/25'
              )}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5">
                {service.picture ? (
                  <Image
                    src={service.picture}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Dumbbell className="h-8 w-8 text-black/15" />
                  </div>
                )}

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Price tag — always visible */}
                <div className="absolute bottom-3 right-3">
                  <span className="rounded-[var(--radius-sm)] bg-white px-2.5 py-1 font-noka text-sm font-black text-[#1d1d1b]">
                    {(service.priceCents / 100).toFixed(2)}€
                  </span>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute left-3 top-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d1d1b]">
                      <Check className="h-4 w-4 stroke-[2.5] text-white" />
                    </span>
                  </div>
                )}
              </div>

              {/* Info strip — always visible */}
              <div className={cn(
                'p-4 transition-colors',
                isSelected ? 'bg-[#1d1d1b]' : 'bg-white'
              )}>
                <div className="flex items-start justify-between gap-2">
                  <p className={cn(
                    'font-noka text-base font-black uppercase tracking-tight leading-tight',
                    isSelected ? 'text-white' : 'text-[#1d1d1b]'
                  )}>
                    {service.name}
                  </p>
                  <span className={cn(
                    'flex flex-shrink-0 items-center gap-1 text-xs font-medium',
                    isSelected ? 'text-white/60' : 'text-black/40'
                  )}>
                    <Clock className="h-3 w-3" />
                    {service.durationMins} min
                  </span>
                </div>
                {service.description && (
                  <p className={cn(
                    'mt-1.5 line-clamp-2 text-xs leading-relaxed',
                    isSelected ? 'text-white/60' : 'text-black/40'
                  )}>
                    {service.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
