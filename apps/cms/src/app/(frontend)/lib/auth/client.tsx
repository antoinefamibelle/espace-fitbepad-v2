'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { internalApi } from '@frontend/lib/api';

export type AuthSessionUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  locale?: string;
  timezone?: string;
  isAdmin: boolean;
  collection: 'users' | 'admins';
};

type SessionResponse = {
  authenticated: boolean;
  user: AuthSessionUser | null;
  token: string | null;
};

function useAuthSessionQuery() {
  return useQuery<SessionResponse>({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const response = await internalApi.get<SessionResponse>('/api/auth/session');
      return response.data;
    },
    staleTime: 30_000,
  });
}

export function useUser() {
  const sessionQuery = useAuthSessionQuery();
  return {
    user: sessionQuery.data?.user ?? null,
    isLoaded: sessionQuery.isFetched,
  };
}

export function useAuth() {
  const sessionQuery = useAuthSessionQuery();
  const token = sessionQuery.data?.token ?? null;
  return {
    isSignedIn: Boolean(sessionQuery.data?.authenticated),
    getToken: async () => token,
  };
}

export function useClerk() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return {
    signOut: async ({ redirectUrl }: { redirectUrl?: string } = {}) => {
      await internalApi.post('/api/auth/logout');
      await queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      router.push(redirectUrl || '/');
      router.refresh();
    },
  };
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  if (isSignedIn) return null;
  return <>{children}</>;
}

export function SignInButton({
  children,
}: {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
}) {
  return <Link href="/login">{children}</Link>;
}

export function UserButton({ afterSignOutUrl = '/' }: { afterSignOutUrl?: string }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}` || 'U';

  return (
    <button
      type="button"
      aria-label="Sign out"
      title="Se deconnecter"
      onClick={() => signOut({ redirectUrl: afterSignOutUrl })}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-sm font-medium"
    >
      {initials}
    </button>
  );
}
