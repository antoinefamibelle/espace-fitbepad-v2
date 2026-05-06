import { useQuery } from '@tanstack/react-query';
import { api } from '@frontend/lib/api';
interface GetTreatmentsByCenterResponse {
  treatments: Treatment[];
  success: true;
}

interface Treatment {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  durationMins: number;
  description?: string;
  picture?: string;
  isActive: boolean;
  centerId: string;
  deciplusActivityId?: string;
  createdAt: Date;
}

export function useTreatmentsByCenter(centerId: string) {
  return useQuery<Treatment[]>({
    queryKey: ['treatments', centerId],
    queryFn: async () => {
      if (!centerId) {
        throw new Error('Center ID is required');
      }
      const response = await api.get<GetTreatmentsByCenterResponse>(`/centers/${centerId}/treatments`);
      return response.data.treatments;
    },
    enabled: !!centerId,
  });
}

export function useTreatmentById(centerId: string, treatmentId: string) {
  return useQuery<Treatment | undefined>({
    queryKey: ['treatments', centerId, treatmentId],
    queryFn: async () => {
      if (!centerId || !treatmentId) return undefined;
      const response = await api.get<GetTreatmentsByCenterResponse>(`/centers/${centerId}/treatments`);
      return response.data.treatments.find((t: Treatment) => t.id === treatmentId);
    },
    enabled: !!centerId && !!treatmentId,
  });
}