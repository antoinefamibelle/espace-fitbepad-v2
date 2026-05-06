// components/ui/spinner.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@frontend/lib/utils'; // Assuming cn utility from Shadcn setup

interface SpinnerProps {
  className?: string;
  size?: number; // Optional size prop
}

export const Spinner = ({ className, size = 24 }: SpinnerProps) => {
  return (
    <Loader2
      className={cn('animate-spin text-primary', className)}
      size={size}
      strokeWidth={2} // Adjust stroke width as needed
    />
  );
};
