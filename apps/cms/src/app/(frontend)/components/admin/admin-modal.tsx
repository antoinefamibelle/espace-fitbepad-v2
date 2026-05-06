'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@frontend/components/ui/dialog';
import { Button } from '@frontend/components/ui/button';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  width?: 'full' | 'auto';
  showCloseButton?: boolean;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  width = 'auto',
  showCloseButton = true,
}: AdminModalProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm min-w-sm',
    md: 'max-w-md min-w-md',
    lg: 'max-w-lg min-w-lg',
    xl: 'max-w-xl min-w-xl',
    '2xl': 'max-w-2xl min-w-2xl',
    '3xl': 'max-w-3xl min-w-3xl',
    '4xl': 'max-w-4xl min-w-4xl',
    '5xl': 'max-w-5xl min-w-5xl',
  };

  const widthClasses = {
    full: 'min-w-[90vw]',
    auto: 'min-w-auto',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent
        className={`rounded-xl border-0 shadow-2xl ${maxWidthClasses[maxWidth]} ${widthClasses[width]}`}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {title}
            </DialogTitle>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {description && (
            <DialogDescription className="text-gray-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
