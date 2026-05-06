import { cn } from '@frontend/lib/utils';
import { ReactNode } from 'react';

interface LuxurySectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'black' | 'gradient' | 'light';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

export const LuxurySection = ({
  children,
  className,
  background = 'white',
  padding = 'lg',
  id
}: LuxurySectionProps) => {
  const backgrounds = {
    white: 'bg-luxury-white',
    black: 'bg-luxury-black',
    gradient: 'luxury-gradient',
    light: 'bg-gray-50'
  };
  
  const paddings = {
    none: '',
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-24'
  };

  return (
    <section 
      id={id}
      className={cn(
        'relative overflow-hidden',
        backgrounds[background],
        paddings[padding],
        className
      )}
    >
      {children}
    </section>
  );
};