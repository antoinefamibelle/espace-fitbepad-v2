import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@frontend/lib/auth/client';
import { internalApi } from '@frontend/lib/api';

type ProfileUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  locale?: string;
  timezone?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
};

type UserResponse = {
  user: ProfileUser;
};

export function useUserProfile() {
  const { isSignedIn } = useAuth();

  return useQuery<ProfileUser, Error>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await internalApi.get<UserResponse>('/api/profile/me');
      return response.data.user;
    },
    enabled: isSignedIn, // Only run query when user is signed in
  });
}
