'use client';

import React, { useEffect, useState } from 'react';
import { User, Calendar, CreditCard, Shield } from 'lucide-react';
import { UserProfileInformation } from '@frontend/profile/components/UserProfileInformation';
import { UserProfileBookings } from '@frontend/profile/components/UserProfileBookings';
import { UserProfilePayments } from '@frontend/profile/components/UserProfilePayments';
import { UserProfileLogout } from '@frontend/profile/components/UserProfileLogout';
import { Skeleton } from '@frontend/components/ui/skeleton';
import { useUserProfile } from '@frontend/lib/hooks/use-user-profile';
import { cn } from '@frontend/lib/utils';

const tabs = [
  { id: 'informations', label: 'Mes Informations', icon: User, component: UserProfileInformation },
  { id: 'reservations', label: 'Mes Réservations', icon: Calendar, component: UserProfileBookings },
  { id: 'paiements', label: 'Paiements', icon: CreditCard, component: UserProfilePayments },
  { id: 'securite', label: 'Sécurité', icon: Shield, component: UserProfileLogout },
];

export default function ProfilePage() {
  const { data: userProfile, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('informations');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const aliases: Record<string, string> = { logout: 'securite' };
    const tab = tabParam ? (aliases[tabParam] ?? tabParam) : null;
    if (tab && tabs.some(t => t.id === tab)) setActiveTab(tab);
  }, []);

  const onTabChange = (value: string) => {
    setActiveTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.replaceState({}, '', url.toString());
  };

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component ?? UserProfileInformation;

  return (
    <div className="min-h-screen bg-white">
      {/* Top identity strip */}
      <div className="border-b border-black/8 bg-white px-6 py-6 md:px-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/30">
              Espace membre
            </p>
            {isLoading ? (
              <Skeleton className="mt-1 h-8 w-48 bg-black/5" />
            ) : (
              <h1 className="font-noka text-2xl font-black uppercase tracking-tight text-[#1d1d1b] md:text-3xl">
                {userProfile?.firstName} {userProfile?.lastName}
              </h1>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-11 w-11 rounded-full bg-black/5" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1d1d1b] text-sm font-bold text-white">
              {`${userProfile?.firstName?.[0] || ''}${userProfile?.lastName?.[0] || ''}`.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* Sidebar nav — desktop */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <nav className="sticky top-8 space-y-0.5">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-[#1d1d1b] text-white'
                        : 'text-black/50 hover:bg-black/5 hover:text-black/80'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-black/40 group-hover:text-black/60')} />
                    <span className="text-xs font-semibold uppercase tracking-wide">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile nav — horizontal scroll */}
          <div className="flex gap-1 overflow-x-auto pb-1 lg:hidden">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex flex-shrink-0 items-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors cursor-pointer',
                    isActive
                      ? 'bg-[#1d1d1b] text-white'
                      : 'bg-black/5 text-black/50 hover:bg-black/8 hover:text-black/80'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <main className="min-w-0 flex-1">
            <ActiveComponent />
          </main>
        </div>
      </div>
    </div>
  );
}
