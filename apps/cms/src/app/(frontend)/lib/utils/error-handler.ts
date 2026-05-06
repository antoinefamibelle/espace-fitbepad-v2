import { toast } from 'sonner';
import { AxiosError } from 'axios';

/**
 * Handles permission errors and displays appropriate French error messages
 */
export function handlePermissionError(error: unknown): void {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      toast.error('Vous n\'avez pas les permissions nécessaires pour effectuer cette action');
      return;
    }
    
    if (error.response?.status === 403) {
      toast.error('Accès refusé : permissions insuffisantes');
      return;
    }
  }
  
  // Check for permission-related error messages from the API
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('Insufficient permissions') || 
      errorMessage.includes('Admin access required') ||
      errorMessage.includes('Access denied') ||
      errorMessage.includes('Unauthorized')) {
    toast.error('Vous n\'avez pas les permissions nécessaires pour effectuer cette action');
    return;
  }
  
  // For other errors, show a generic error message
  toast.error('Une erreur est survenue. Veuillez réessayer.');
}

/**
 * Handles errors with context-specific French messages
 */
export function handleContextualError(error: unknown, context: string): void {
  if (error instanceof AxiosError && (error.response?.status === 401 || error.response?.status === 403)) {
    handlePermissionError(error);
    return;
  }
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('Insufficient permissions') || 
      errorMessage.includes('Admin access required') ||
      errorMessage.includes('Access denied') ||
      errorMessage.includes('Unauthorized')) {
    handlePermissionError(error);
    return;
  }
  
  // Show context-specific error
  toast.error(`Erreur lors de ${context}`);
}