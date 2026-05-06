import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

const offresLinks = [
  { href: '/nos-services/les-coach', label: 'Nos experts' },
  { href: '/nos-services/les-cours', label: 'Nos activités' },
  { href: '/nos-services/les-espaces', label: 'Nos espaces' },
];

const navLinks = [
  { href: '/planning', label: 'Planning' },
  { href: '/reservation', label: 'Réservation' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/legal/mentions-legales', label: 'Mentions légales' },
  { href: '/legal/cgv', label: 'CGV' },
  { href: '/legal/confidentialite', label: 'Politique de confidentialité' },
];

const hours = [
  { days: 'Lundi – Vendredi', time: '09h00 – 19h00' },
  { days: 'Samedi', time: '10h00 – 17h00' },
  { days: 'Dimanche', time: 'Fermé' },
];

export default function Footer() {
  const phone = process.env.NEXT_PUBLIC_DEFAULT_PHONE_NUMBER || '+33745175554';
  const email = process.env.NEXT_PUBLIC_DEFAULT_EMAIL || 'contact@espacesports.com';

  return (
    <footer className="bg-[#111] text-white">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-32 w-[130px]">
                <Image
                  src="/logo.png"
                  alt="L'Espace Fitbepad"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-[220px]">
              Fitness, bien-être et padel réunis dans un seul espace premium à Verberie.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/fitbepad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-white/15 rounded-[var(--radius-md)] flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/fitbepad"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-white/15 rounded-[var(--radius-md)] flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nos offres */}
          <div>
            <p className="text-[#52ad77] text-xs font-bold tracking-[0.25em] uppercase mb-6">
              Nos offres
            </p>
            <ul className="space-y-3">
              {offresLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-[#52ad77] text-xs font-bold tracking-[0.25em] uppercase mt-10 mb-6">
              Navigation
            </p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[#52ad77] text-xs font-bold tracking-[0.25em] uppercase mb-6">
              Contact
            </p>
            <ul className="space-y-5">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="group flex items-start gap-3 hover:opacity-80 transition-opacity"
                >
                  <Phone className="w-4 h-4 text-white/30 mt-0.5 shrink-0 group-hover:text-[#52ad77] transition-colors" />
                  <span className="text-white/60 text-sm group-hover:text-white transition-colors">
                    {phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-3 hover:opacity-80 transition-opacity"
                >
                  <Mail className="w-4 h-4 text-white/30 mt-0.5 shrink-0 group-hover:text-[#52ad77] transition-colors" />
                  <span className="text-white/60 text-sm group-hover:text-white transition-colors">
                    {email}
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white/60 text-sm">24 Route de Saint-Sauveur</p>
                    <p className="text-white/40 text-sm">60410 Verberie</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-[#52ad77]" />
              <p className="text-[#52ad77] text-xs font-bold tracking-[0.25em] uppercase">
                Horaires
              </p>
            </div>
            <ul className="space-y-3">
              {hours.map((row) => (
                <li key={row.days} className="flex justify-between items-baseline gap-4">
                  <span className="text-white/50 text-sm shrink-0">{row.days}</span>
                  <span
                    className={`text-sm font-medium shrink-0 ${
                      row.time === 'Fermé' ? 'text-white/25' : 'text-white/80'
                    }`}
                  >
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 mt-10 bg-white text-[#1d1d1b] px-6 py-3 text-sm font-semibold rounded-[var(--radius-md)] hover:bg-white/90 transition-colors cursor-pointer"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom legal strip */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} L&apos;Espace Fitbepad. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/30 text-xs hover:text-white/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
