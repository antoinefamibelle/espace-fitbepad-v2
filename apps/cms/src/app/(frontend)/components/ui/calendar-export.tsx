'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@frontend/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@frontend/components/ui/dropdown-menu';
import { Badge } from '@frontend/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@frontend/components/ui/tooltip';
import { Calendar, ChevronDown, Download, ExternalLink, Check, Smartphone } from 'lucide-react';
import { 
  BookingCalendarData,
  bookingToCalendarEvent,
  openCalendarUrl,
  downloadICSFile,
  detectPreferredCalendar,
  supportsNativeCalendar,
  CALENDAR_PROVIDERS,
  CalendarProvider
} from '@frontend/lib/utils/calendar';
import { cn } from '@frontend/lib/utils';

interface CalendarExportProps {
  booking: BookingCalendarData;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function CalendarExport({ 
  booking, 
  variant = 'outline', 
  size = 'sm',
  showLabel = true,
  className 
}: CalendarExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<CalendarProvider | null>(null);
  
  const calendarEvent = bookingToCalendarEvent(booking);
  const preferredCalendar = detectPreferredCalendar();
  const hasNativeSupport = supportsNativeCalendar();

  const handleCalendarExport = (provider: CalendarProvider) => {
    const calendarProvider = CALENDAR_PROVIDERS[provider];
    
    if (provider === 'apple' || provider === 'ics') {
      downloadICSFile(calendarEvent, `rdv-${booking.treatmentName.toLowerCase().replace(/\s+/g, '-')}-${booking.date}.ics`);
    } else {
      const url = calendarProvider.generateUrl(calendarEvent);
      if (url) {
        openCalendarUrl(url);
      }
    }
    
    // Show success feedback
    setRecentlyAdded(provider);
    setTimeout(() => setRecentlyAdded(null), 2000);
    setIsOpen(false);
  };

  const quickAddToPreferred = () => {
    handleCalendarExport(preferredCalendar === 'other' ? 'google' : preferredCalendar);
  };

  // Get sorted providers with preferred one first
  const sortedProviders = Object.entries(CALENDAR_PROVIDERS).sort(([keyA], [keyB]) => {
    if (keyA === preferredCalendar) return -1;
    if (keyB === preferredCalendar) return 1;
    return 0;
  });

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1", className)}>
        {/* Quick add button for preferred calendar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={quickAddToPreferred}
              className={cn(
                "transition-all duration-200",
                recentlyAdded && "bg-green-100 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300"
              )}
            >
              {recentlyAdded ? (
                <Check className="w-4 h-4" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              {showLabel && (
                <span className="ml-2">
                  {recentlyAdded ? 'Ajouté' : 'Ajouter au calendrier'}
                </span>
              )}
              {hasNativeSupport && (
                <Smartphone className="w-3 h-3 ml-1 opacity-60" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {recentlyAdded 
                ? 'Événement ajouté au calendrier' 
                : `Ajouter à ${CALENDAR_PROVIDERS[preferredCalendar === 'other' ? 'google' : preferredCalendar].name}`
              }
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Dropdown for all calendar options */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className="px-2"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ajouter au calendrier
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {sortedProviders.map(([key, provider]) => {
              const isPreferred = key === preferredCalendar;
              const wasRecentlyAdded = recentlyAdded === key;
              
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleCalendarExport(key as CalendarProvider)}
                  className={cn(
                    "flex items-center gap-3 cursor-pointer transition-colors",
                    wasRecentlyAdded && "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg" role="img" aria-label={provider.name}>
                      {provider.icon}
                    </span>
                    <span className="font-medium">{provider.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {isPreferred && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        Recommandé
                      </Badge>
                    )}
                    
                    {wasRecentlyAdded ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : key === 'apple' || key === 'ics' ? (
                      <Download className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator />
            
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                Télécharge un fichier .ics
              </p>
              <p className="flex items-center gap-1 mt-1">
                <ExternalLink className="w-3 h-3" />
                Ouvre dans le navigateur
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

interface QuickCalendarExportProps {
  booking: BookingCalendarData;
  className?: string;
}

export function QuickCalendarExport({ booking, className }: QuickCalendarExportProps) {
  const [isAdded, setIsAdded] = useState(false);
  const preferredCalendar = detectPreferredCalendar();
  
  const handleQuickAdd = () => {
    const calendarEvent = bookingToCalendarEvent(booking);
    const provider = CALENDAR_PROVIDERS[preferredCalendar === 'other' ? 'google' : preferredCalendar];
    
    if (preferredCalendar === 'apple' || preferredCalendar === 'other') {
      downloadICSFile(calendarEvent);
    } else {
      const url = provider.generateUrl(calendarEvent);
      if (url) {
        openCalendarUrl(url);
      }
    }
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleQuickAdd}
        className={cn(
          "w-full justify-start transition-all duration-200",
          isAdded && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        )}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Ajouté au calendrier</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Ajouter au calendrier</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}