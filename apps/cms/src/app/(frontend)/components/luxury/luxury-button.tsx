import { cn } from '@frontend/lib/utils';
import { forwardRef } from 'react';

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'fitness' | 'wellness' | 'padel'
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      wellness: 'bg-luxury-green text-luxury-white hover:bg-luxury-black focus:ring-luxury-black',
      padel: 'bg-luxury-purple text-luxury-white hover:bg-luxury-black focus:ring-luxury-purple',
      fitness: 'bg-black text-white border border-black hover:bg-white hover:text-black focus:ring-luxury-black',
      primary: 'bg-black text-white border border-black hover:bg-white hover:text-black focus:ring-luxury-black',
      secondary: 'bg-luxury-green text-luxury-white hover:bg-luxury-black focus:ring-luxury-black',
      accent: 'bg-luxury-purple text-luxury-white hover:bg-luxury-black focus:ring-luxury-purple',
      ghost: 'bg-transparent border-2 border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-luxury-white focus:ring-luxury-black'
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-12 py-5 text-xl rounded-2xl'
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          'luxury-hover-lift rounded-full',
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

LuxuryButton.displayName = 'LuxuryButton';