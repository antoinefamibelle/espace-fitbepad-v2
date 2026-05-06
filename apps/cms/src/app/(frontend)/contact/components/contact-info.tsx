'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const WEEKDAYS = [
  { id: 1, name: 'Lundi', short: 'Lun' },
  { id: 2, name: 'Mardi', short: 'Mar' },
  { id: 3, name: 'Mercredi', short: 'Mer' },
  { id: 4, name: 'Jeudi', short: 'Jeu' },
  { id: 5, name: 'Vendredi', short: 'Ven' },
  { id: 6, name: 'Samedi', short: 'Sam' },
  { id: 0, name: 'Dimanche', short: 'Dim' },
];

function HoursDisplay() {
  const hoursData: Record<number, { open: string; close: string }[] | null> = {
    1: [{ open: '09:00', close: '19:00' }],
    2: [{ open: '09:00', close: '19:00' }],
    3: [{ open: '09:00', close: '19:00' }],
    4: [{ open: '09:00', close: '19:00' }],
    5: [{ open: '09:00', close: '19:00' }],
    6: [{ open: '10:00', close: '17:00' }],
    0: null,
  };

  const today = new Date().getDay();

  const rows = Object.entries(hoursData).map(([weekdayStr, dayHours]) => {
    const weekday = parseInt(weekdayStr);
    const day = WEEKDAYS.find((d) => d.id === weekday);
    const isToday = weekday === today;
    return {
      name: day?.name ?? '',
      time: dayHours ? `${dayHours[0].open} – ${dayHours[0].close}` : 'Fermé',
      isToday,
      isClosed: !dayHours,
    };
  });

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.name} className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0">
          <span className={`text-sm ${row.isToday ? 'text-[#52ad77] font-semibold' : 'text-white/60'}`}>
            {row.name}
            {row.isToday && (
              <span className="ml-2 text-[10px] bg-[#52ad77]/20 text-[#52ad77] px-1.5 py-0.5 rounded-full font-bold tracking-wide uppercase">
                Auj.
              </span>
            )}
          </span>
          <span className={`text-sm font-medium ${row.isClosed ? 'text-white/30' : row.isToday ? 'text-[#52ad77]' : 'text-white/80'}`}>
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ContactInfo() {
  const phone = process.env.NEXT_PUBLIC_DEFAULT_PHONE_NUMBER || '+33745175554';
  const email = process.env.NEXT_PUBLIC_DEFAULT_EMAIL || 'contact@espacesports.com';

  return (
    <div className="h-full bg-[#1d1d1b] px-8 md:px-12 py-14 flex flex-col gap-12">
      {/* Direct contacts */}
      <div>
        <p className="text-[#52ad77] text-xs font-bold tracking-[0.25em] uppercase mb-8">
          Contact direct
        </p>
        <div className="space-y-6">
          <a
            href={`tel:${phone}`}
            className="group flex items-start gap-5 hover:opacity-80 transition-opacity"
          >
            <div className="mt-0.5 w-10 h-10 rounded-[var(--radius-md)] border border-white/15 flex items-center justify-center shrink-0 group-hover:border-[#52ad77]/50 transition-colors">
              <Phone className="w-4 h-4 text-white/60 group-hover:text-[#52ad77] transition-colors" />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Téléphone</p>
              <p className="text-white font-semibold">{phone}</p>
            </div>
          </a>

          <a
            href={`mailto:${email}`}
            className="group flex items-start gap-5 hover:opacity-80 transition-opacity"
          >
            <div className="mt-0.5 w-10 h-10 rounded-[var(--radius-md)] border border-white/15 flex items-center justify-center shrink-0 group-hover:border-[#52ad77]/50 transition-colors">
              <Mail className="w-4 h-4 text-white/60 group-hover:text-[#52ad77] transition-colors" />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</p>
              <p className="text-white font-semibold">{email}</p>
            </div>
          </a>

          <div className="flex items-start gap-5">
            <div className="mt-0.5 w-10 h-10 rounded-[var(--radius-md)] border border-white/15 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-white/60" />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Adresse</p>
              <p className="text-white font-semibold">Verberie, Oise</p>
              <p className="text-white/50 text-sm mt-0.5">60410</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-4 h-4 text-[#52ad77]" />
          <p className="text-[#52ad77] text-xs font-bold tracking-[0.25em] uppercase">
            Horaires d'ouverture
          </p>
        </div>
        <HoursDisplay />
      </div>

      {/* CTA nudge */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-white/40 text-sm leading-relaxed">
          Réponse garantie sous <span className="text-white/70 font-medium">24h ouvrées</span>. Pour les urgences, appelez-nous directement.
        </p>
      </div>
    </div>
  );
}
