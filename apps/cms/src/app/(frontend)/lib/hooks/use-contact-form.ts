import { useState } from 'react';
import { api } from '@frontend/lib/api';
import type { ContactFormRequest, ContactFormResponse } from 'shared/dist';

interface UseContactFormState {
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
}

interface UseContactFormReturn extends UseContactFormState {
  submitContactForm: (data: ContactFormRequest) => Promise<boolean>;
  resetStatus: () => void;
}

export function useContactForm(): UseContactFormReturn {
  const [state, setState] = useState<UseContactFormState>({
    isSubmitting: false,
    submitStatus: 'idle',
    errorMessage: '',
  });

  const submitContactForm = async (data: ContactFormRequest): Promise<boolean> => {
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      submitStatus: 'idle',
      errorMessage: '',
    }));

    try {
      const response = await api.post<ContactFormResponse>('/api/contact', data);
      
      if (response.data.success) {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          submitStatus: 'success',
        }));
        return true;
      } else {
        throw new Error(response.data.message || 'Une erreur est survenue');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Une erreur inattendue est survenue';
      
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        submitStatus: 'error',
        errorMessage,
      }));
      return false;
    }
  };

  const resetStatus = () => {
    setState(prev => ({
      ...prev,
      submitStatus: 'idle',
      errorMessage: '',
    }));
  };

  return {
    ...state,
    submitContactForm,
    resetStatus,
  };
}