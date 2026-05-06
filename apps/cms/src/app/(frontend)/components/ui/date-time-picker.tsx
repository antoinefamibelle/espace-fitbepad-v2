'use client';

import * as React from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

import { cn } from '@frontend/lib/utils';
import { Button } from '@frontend/components/ui/button';
import { Calendar } from '@frontend/components/ui/calendar';
import { Input } from '@frontend/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@frontend/components/ui/popover';

interface DateTimePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = 'Sélectionner une date et heure',
  disabled = false,
  className,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date,
  );
  const [timeValue, setTimeValue] = React.useState<string>(
    date ? moment(date).format('HH:mm') : '',
  );

  React.useEffect(() => {
    setSelectedDate(date);
    setTimeValue(date ? moment(date).format('HH:mm') : '');
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const combinedDate = new Date(newDate);
      combinedDate.setHours(hours || 0, minutes || 0, 0, 0);
      setSelectedDate(combinedDate);
      onDateChange?.(combinedDate);
    } else {
      setSelectedDate(undefined);
      onDateChange?.(undefined);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours || 0, minutes || 0, 0, 0);
      onDateChange?.(newDate);
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'flex-1 justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground',
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate
              ? moment(selectedDate).locale('fr').format('LL')
              : 'Sélectionner une date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="relative">
        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="time"
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="pl-10 w-32"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
