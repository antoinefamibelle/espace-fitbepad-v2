import { cn } from '@frontend/lib/utils';
import { ReactNode } from 'react';

interface LuxuryCardProps {
  children: ReactNode;
  variant?: 'elevated' | 'bordered' | 'glass' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  hover?: boolean;
}

export const LuxuryCard = ({
  children,
  variant = 'elevated',
  padding = 'lg',
  className,
  hover = true
}: LuxuryCardProps) => {
  const variants = {
    elevated: 'bg-luxury-white luxury-shadow border border-gray-100',
    bordered: 'bg-luxury-white luxury-border',
    glass: 'glass-card backdrop-blur-md',
    gradient: 'luxury-gradient text-luxury-white'
  };
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        hover && 'luxury-hover-lift cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};