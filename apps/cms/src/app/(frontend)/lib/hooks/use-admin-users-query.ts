import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // Assurez-vous qu'axios est installé ou utilisez fetch
import { User } from 'shared'; // S'assurer que ce type User est correct et correspond à la réponse API

// Définir les types pour les filtres
export interface AdminUsersFilters {
  firstName?: string;
  lastName?: string;
  email?: string;
  centerId?: string;
  // Ajouter d'autres filtres si nécessaire (ex: page, limit pour la pagination)
}

const fetchAdminUsers = async (filters: AdminUsersFilters): Promise<User[]> => {
  // Construire les paramètres de requête à partir des filtres
  const params = new URLSearchParams();
  if (filters.firstName) params.append('firstName', filters.firstName);
  if (filters.lastName) params.append('lastName', filters.lastName);
  if (filters.email) params.append('email', filters.email);
  if (filters.centerId) params.append('centerId', filters.centerId);

  const { data } = await axios.get(`/api/admin/users?${params.toString()}`);
  return data;
};

export const useAdminUsersQuery = (filters: AdminUsersFilters) => {
  return useQuery<User[], Error>({ // Spécifier explicitement les types génériques pour useQuery
    queryKey: ['adminUsers', filters], // La clé de requête inclut les filtres pour un re-fetching correct
    queryFn: () => fetchAdminUsers(filters),
    // Options supplémentaires de React Query si nécessaire (ex: staleTime, cacheTime)
  });
};
