import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@frontend/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

export const Button = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-full transition-colors duration-200';

  const variants = {
    default:
      'text-white bg-primary hover:text-primary border border-primary hover:bg-transparent',
    outline:
      'border border-primary text-primary hover:text-white hover:bg-primary',
  };

  const sizes = {
    sm: 'text-base py-3 px-6',
    md: 'text-lg py-4 px-8',
    lg: 'text-xl py-5 px-10',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
