import { cn } from '@frontend/lib/utils';
import { ReactNode } from 'react';

interface LuxuryTextProps {
  children: ReactNode;
  variant?: 'body' | 'lead' | 'caption' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'black' | 'white' | 'green' | 'purple' | 'muted' | 'fitness' | 'wellness' | 'padel';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export const LuxuryText = ({
  children,
  variant = 'body',
  size = 'md',
  color = 'black',
  align = 'left',
  className,
  as: Tag = 'p'
}: LuxuryTextProps) => {
  const variants = {
    body: 'font-normal leading-relaxed',
    lead: 'font-medium leading-relaxed',
    caption: 'font-normal leading-tight',
    muted: 'font-normal leading-relaxed opacity-70'
  };
  
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  const colors = {
    black: 'text-luxury-black',
    white: 'text-luxury-white',
    green: 'text-luxury-green',
    purple: 'text-luxury-purple',
    muted: 'text-gray-600',
    fitness: 'text-luxury-black',
    wellness: 'text-luxury-green',
    padel: 'text-luxury-purple'
  };
  
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  return (
    <Tag
      className={cn(
        'font-poppins',
        variants[variant],
        sizes[size],
        colors[color],
        alignments[align],
        className
      )}
    >
      {children}
    </Tag>
  );
};