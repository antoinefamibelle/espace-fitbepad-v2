import { cn } from '@frontend/lib/utils';
import { JSX, ReactNode } from 'react';

interface LuxuryHeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'primary' | 'gradient' | 'white' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const LuxuryHeading = ({
  children,
  level = 1,
  variant = 'primary',
  size = 'lg',
  align = 'left',
  className
}: LuxuryHeadingProps) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  const variants = {
    primary: 'text-luxury-black',
    gradient: 'luxury-text-gradient',
    white: 'text-luxury-white',
    black: 'text-luxury-black'
  };
  
  const sizes = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-5xl md:text-6xl lg:text-7xl',
    xxl: 'text-6xl md:text-7xl lg:text-8xl'
  };
  
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <Tag className={cn(
        'font-heading font-bold leading-tight tracking-tight',
        variants[variant],
        sizes[size],
        alignments[align],
        className
      )}
    >
      {children}
    </Tag>
  );
};