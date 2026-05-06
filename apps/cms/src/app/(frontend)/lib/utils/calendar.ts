import moment from 'moment';

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  url?: string;
}

export interface BookingCalendarData {
  id: string;
  treatmentName: string;
  centerName: string;
  centerAddress: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime?: string; // HH:mm format
  duration?: number; // minutes
  phone?: string;
  website?: string;
}

/**
 * Converts booking data to calendar event format
 */
export function bookingToCalendarEvent(
  booking: BookingCalendarData,
): CalendarEvent {
  // Parse date and start time using moment
  const dateStr = `${booking.date} ${booking.startTime}`;
  const startDate = moment(dateStr, 'YYYY-MM-DD HH:mm').toDate();

  // Calculate end time
  let endDate: Date;
  if (booking.endTime) {
    const endDateStr = `${booking.date} ${booking.endTime}`;
    endDate = moment(endDateStr, 'YYYY-MM-DD HH:mm').toDate();
  } else if (booking.duration) {
    endDate = moment(startDate).add(booking.duration, 'minutes').toDate();
  } else {
    // Default to 1 hour if no end time or duration provided
    endDate = moment(startDate).add(1, 'hour').toDate();
  }

  // Create description with appointment details
  const description = createEventDescription({
    treatmentName: booking.treatmentName,
    centerName: booking.centerName,
    centerAddress: booking.centerAddress,
    phone: booking.phone,
    website: booking.website,
  });

  return {
    title: `${booking.treatmentName} - ${booking.centerName}`,
    description,
    location: `${booking.centerName}, ${booking.centerAddress}`,
    startDate,
    endDate,
    url: booking.website,
  };
}

/**
 * Creates a formatted description for the calendar event
 */
function createEventDescription(data: {
  treatmentName: string;
  centerName: string;
  centerAddress: string;
  phone?: string;
  website?: string;
}): string {
  const lines = [
    `Rendez-vous : ${data.treatmentName}`,
    `Centre : ${data.centerName}`,
    `Adresse : ${data.centerAddress}`,
  ];

  if (data.phone) {
    lines.push(`Téléphone : ${data.phone}`);
  }

  if (data.website) {
    lines.push(`Site web : ${data.website}`);
  }

  lines.push('');
  lines.push('Préparation :');
  lines.push('• Arrivez 10 minutes avant votre rendez-vous');
  lines.push("• Apportez une pièce d'identité");
  lines.push('• Portez des vêtements confortables');

  return lines.join('\n');
}

/**
 * Formats date for various calendar providers
 */
function formatDateForCalendar(
  date: Date,
  type: 'google' | 'outlook' | 'ics' = 'ics',
): string {
  const momentDate = moment(date);

  switch (type) {
    case 'google':
    case 'outlook':
      // Google Calendar and Outlook use YYYYMMDDTHHMMSSZ format
      return momentDate.format('YYYYMMDDTHHmmss[Z]');
    case 'ics':
    default:
      // ICS format: YYYYMMDDTHHMMSSZ
      return momentDate.format('YYYYMMDDTHHmmss[Z]');
  }
}

/**
 * Escapes special characters for calendar formats
 */
function escapeCalendarText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Generates Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const startDate = formatDateForCalendar(event.startDate, 'google');
  const endDate = formatDateForCalendar(event.endDate, 'google');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description,
    location: event.location,
    trp: 'false',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates Outlook Calendar URL
 */
export function generateOutlookCalendarUrl(event: CalendarEvent): string {
  const startDate = moment(event.startDate).toISOString();
  const endDate = moment(event.endDate).toISOString();

  const params = new URLSearchParams({
    subject: event.title,
    startdt: startDate,
    enddt: endDate,
    body: event.description,
    location: event.location,
    allday: 'false',
    uid: `fitbepad-booking-${Date.now()}`,
    rru: 'addevent',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generates Yahoo Calendar URL
 */
export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const duration = moment
    .duration(moment(event.endDate).diff(moment(event.startDate)))
    .asMinutes();

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: formatDateForCalendar(event.startDate, 'google'),
    dur: Math.round(duration).toString().padStart(4, '0'), // Format as HHMM
    desc: event.description,
    in_loc: event.location,
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Generates ICS file content for download
 */
export function generateICSFile(event: CalendarEvent): string {
  const startDate = formatDateForCalendar(event.startDate, 'ics');
  const endDate = formatDateForCalendar(event.endDate, 'ics');
  const now = formatDateForCalendar(new Date(), 'ics');
  const uid = `fitbepad-booking-${Date.now()}@fitbepad.fr`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Espace Sports//Calendar//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(event.description)}`,
    `LOCATION:${escapeCalendarText(event.location)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rappel: Rendez-vous dans 15 minutes',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rappel: Rendez-vous dans 1 heure',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Downloads ICS file
 */
export function downloadICSFile(event: CalendarEvent, filename?: string): void {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download =
    filename ||
    `rendez-vous-${moment(event.startDate).format('YYYY-MM-DD')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}

/**
 * Opens calendar URL in new window/tab
 */
export function openCalendarUrl(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Detects user's preferred calendar based on user agent
 */
export function detectPreferredCalendar():
  | 'google'
  | 'outlook'
  | 'apple'
  | 'other' {
  if (typeof window === 'undefined') return 'other';

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (
    userAgent.includes('iphone') ||
    userAgent.includes('ipad') ||
    userAgent.includes('mac')
  ) {
    return 'apple';
  }

  if (userAgent.includes('android')) {
    return 'google';
  }

  if (userAgent.includes('windows')) {
    return 'outlook';
  }

  return 'other';
}

/**
 * Checks if device supports native calendar integration
 */
export function supportsNativeCalendar(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();

  // iOS devices support native calendar integration
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return true;
  }

  // Android devices with recent Chrome support it
  if (userAgent.includes('android') && userAgent.includes('chrome')) {
    return true;
  }

  return false;
}

/**
 * All available calendar providers
 */
export const CALENDAR_PROVIDERS = {
  google: {
    name: 'Google Calendar',
    icon: '📅',
    generateUrl: generateGoogleCalendarUrl,
    color: '#4285f4',
  },
  outlook: {
    name: 'Outlook',
    icon: '📧',
    generateUrl: generateOutlookCalendarUrl,
    color: '#0078d4',
  },
  yahoo: {
    name: 'Yahoo Calendar',
    icon: '🟣',
    generateUrl: generateYahooCalendarUrl,
    color: '#7b0eb8',
  },
  apple: {
    name: 'Apple Calendar',
    icon: '🍎',
    generateUrl: (event: CalendarEvent) => {
      // For Apple Calendar, we'll use ICS download
      downloadICSFile(event);
      return '';
    },
    color: '#007aff',
  },
  ics: {
    name: 'Autre (fichier ICS)',
    icon: '📄',
    generateUrl: (event: CalendarEvent) => {
      downloadICSFile(event);
      return '';
    },
    color: '#6b7280',
  },
} as const;

export type CalendarProvider = keyof typeof CALENDAR_PROVIDERS;
