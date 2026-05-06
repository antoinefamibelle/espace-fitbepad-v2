import { useUserProfile } from './use-user-profile';

export function useIsAdmin() {
  const { data: user, isLoading, error } = useUserProfile();

  return {
    isAdmin: user?.isAdmin || false,
    isLoading,
    error,
    user,
  };
}
