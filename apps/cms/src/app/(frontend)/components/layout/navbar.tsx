'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  X,
  Calendar,
  User,
  Shield,
  Users,
  Dumbbell,
  Building,
  ChevronDown,
  Zap,
  Leaf,
} from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton as ClerkSignInButton,
} from '@frontend/lib/auth/client';
import { useIsAdmin } from '@frontend/lib/hooks/use-is-admin';
import { cn } from '@frontend/lib/utils';

const navLinks = [
  { href: '/planning', label: 'Planning' },
  { href: '/contact', label: 'Nous contacter' },
];

const offresLinks = [
  {
    id: 'fitness',
    title: 'Fitness',
    description: '400m² Technogym, coachs certifiés, 7j/7',
    Icon: Dumbbell,
    color: '#1d1d1b',
    href: '/nos-services/fitness',
  },
  {
    id: 'padel',
    title: 'Padel',
    description: '2 terrains FIP, éclairage LED, réservation en ligne',
    Icon: Zap,
    color: '#9e4f96',
    href: '/nos-services/padel',
  },
  {
    id: 'wellness',
    title: 'Bien-être',
    description: 'Ostéopathie, massage, cupping — sur rendez-vous',
    Icon: Leaf,
    color: '#52ad77',
    href: '/nos-services/bien-etre',
  },
  {
    id: 'experts',
    title: 'Nos experts',
    description: 'Des coachs dédiés pour votre progression',
    Icon: Users,
    color: '#52ad77',
    href: '/nos-services/les-coach',
  },
  {
    id: 'activities',
    title: 'Nos cours',
    description: 'Planning collectif hebdomadaire',
    Icon: Building,
    color: '#9e4f96',
    href: '/nos-services/les-cours',
  },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin, isLoading } = useIsAdmin();
  const payloadAdminUrl = `${
    process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || ''
  }/admin`;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white border-b border-gray-100 shadow-sm'
            : 'bg-white/90 backdrop-blur-md border-b border-gray-100/60',
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative h-32 w-[130px]">
                <Image
                  src="/logo.png"
                  alt="Espace"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Center Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {/* Offres Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer',
                    isDropdownOpen
                      ? 'text-luxury-black bg-gray-50'
                      : 'text-gray-600 hover:text-luxury-black hover:bg-gray-50',
                  )}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  Nos offres
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      isDropdownOpen && 'rotate-180',
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] z-50"
                    >
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-2 w-[580px]">
                        {/* Service pages — 3 cols */}
                        <div className="grid grid-cols-3 gap-1">
                          {offresLinks.slice(0, 3).map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={() => setIsDropdownOpen(false)}
                              className="group flex flex-col gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-150"
                            >
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${item.color}18` }}
                              >
                                <item.Icon className="w-5 h-5" style={{ color: item.color }} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {/* Secondary links */}
                        <div className="border-t border-gray-100 mt-1 pt-1 grid grid-cols-2 gap-1">
                          {offresLinks.slice(3).map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${item.color}18` }}
                              >
                                <item.Icon className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-luxury-black rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <SignedIn>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-luxury-black rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  Mon compte
                </Link>
                {isAdmin && !isLoading && (
                  <Link
                    href={payloadAdminUrl}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                    title="Administration"
                  >
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
              </SignedIn>

              <SignedOut>
                <ClerkSignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-luxury-black rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    Se connecter
                  </button>
                </ClerkSignInButton>
              </SignedOut>

              <Link
                href="/reservation"
                className="flex items-center gap-2 px-5 py-2.5 bg-luxury-black text-white text-sm font-semibold rounded-full hover:bg-luxury-black/85 transition-colors duration-200"
              >
                <Calendar className="w-4 h-4" />
                Réserver
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center gap-2">
              <Link
                href="/reservation"
                className="flex items-center gap-1.5 px-4 py-2 bg-luxury-black text-white text-sm font-semibold rounded-full"
              >
                <Calendar className="w-3.5 h-3.5" />
                Réserver
              </Link>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[320px] bg-white flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-[72px] border-b border-gray-100 flex-shrink-0">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <div className="relative h-32 w-[130px]">
                    <Image
                      src="/logo.png"
                      alt="Espace"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {/* Offres */}
                <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Nos offres
                </p>
                {offresLinks.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}18` }}
                    >
                      <item.Icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <span className="text-[15px] font-medium text-gray-800">
                      {item.title}
                    </span>
                  </Link>
                ))}

                <div className="h-px bg-gray-100 mx-3 my-3" />

                {/* Main Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-[15px] font-medium text-gray-700 hover:text-luxury-black hover:bg-gray-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-gray-100 mx-3 my-3" />

                {/* Account */}
                <SignedIn>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-gray-700 hover:text-luxury-black hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Mon profil
                  </Link>
                  {isAdmin && !isLoading && (
                    <Link
                      href={payloadAdminUrl}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Administration
                    </Link>
                  )}
                </SignedIn>

                <SignedOut>
                  <ClerkSignInButton mode="modal">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left flex items-center px-3 py-3 rounded-xl text-[15px] font-medium text-gray-700 hover:text-luxury-black hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </ClerkSignInButton>
                </SignedOut>
              </div>

              {/* Pinned CTA */}
              <div className="px-4 py-5 border-t border-gray-100 flex-shrink-0">
                <Link
                  href="/reservation"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-luxury-black text-white text-sm font-semibold rounded-full hover:bg-luxury-black/85 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Réserver maintenant
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
