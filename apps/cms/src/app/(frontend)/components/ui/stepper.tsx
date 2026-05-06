'use client';

import React from 'react';
import { cn } from '@frontend/lib/utils';
import { Button } from '@frontend/components/ui/button';

export interface Step {
  title: string;
  description: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  totalSteps: number;
  className?: string;
  onPrevious?: () => void;
  isFinalStep?: boolean;
  onFinalAction?: () => void;
  finalButtonText?: string;
  previousButtonText?: string;
  hideNextButton?: boolean;
  children?: React.ReactNode;
}

export function Stepper({ 
  steps, 
  currentStep, 
  totalSteps,
  className,
  onPrevious,
  isFinalStep,
  onFinalAction,
  finalButtonText = "Finish",
  previousButtonText = "Previous",
  hideNextButton,
  children 
}: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <div
              key={step.title}
              className={cn(
                'flex flex-col items-center relative z-10',
                'flex-1',
              )}
            >
              {/* Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute w-full h-1 top-5 z-0',
                    isCompleted ? 'bg-primary' : 'bg-muted',
                  )}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background z-10',
                  isCompleted &&
                    'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary',
                  !isCompleted && !isCurrent && 'border-muted',
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isCurrent && 'text-primary',
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="mt-4 text-center">
                <div
                  className={cn(
                    'text-sm font-medium',
                    (isCompleted || isCurrent) && 'text-primary',
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Content Area */}
      {children && (
        <div className="mt-8">
          {children}
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <div>
          {currentStep > 1 && onPrevious && (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
            >
              {previousButtonText}
            </Button>
          )}
        </div>
        
        <div>
          {isFinalStep && onFinalAction && (
            <Button
              type="button"
              onClick={onFinalAction}
            >
              {finalButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stepper;
