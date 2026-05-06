import { useCallback } from 'react';
import { handlePermissionError, handleContextualError } from '@frontend/lib/utils/error-handler';

/**
 * Hook for handling errors in React components with French permission messages
 */
export function useErrorHandler() {
  const handleError = useCallback((error: unknown, context?: string) => {
    if (context) {
      handleContextualError(error, context);
    } else {
      handlePermissionError(error);
    }
  }, []);

  return { handleError };
}

/**
 * Hook for React Query mutations with automatic permission error handling
 */
export function useMutationErrorHandler() {
  const handleMutationError = useCallback((error: unknown, context?: string) => {
    // Permission errors (401/403) are already handled by the API interceptor
    // This is for additional client-side error handling if needed
    if (context) {
      handleContextualError(error, context);
    }
  }, []);

  return { handleMutationError };
}