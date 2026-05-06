import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export interface ApiError {
  error: string;
  details?: any;
  status: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}

export class ApiException extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export const createErrorResponse = (
  message: string,
  status: number = 500,
  details?: any
): NextResponse<ApiError> => {
  return NextResponse.json(
    { error: message, details, status },
    { status }
  );
};

export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json({ data, message }, { status });
};

export const handleApiError = (error: unknown): NextResponse<ApiError> => {
  console.error('API Error:', error);
  
  if (error instanceof ApiException) {
    return createErrorResponse(error.message, error.status, error.details);
  }
  
  if (error instanceof z.ZodError) {
    return createErrorResponse('Données invalides', 400, error.flatten());
  }
  
  if (error instanceof Error) {
    return createErrorResponse(error.message, 500);
  }
  
  return createErrorResponse('Erreur interne du serveur', 500);
};

export const validateRequestBody = async <T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> => {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiException('Validation échouée', 400, error.flatten());
    }
    throw new ApiException('Corps de requête invalide', 400);
  }
};

export const withApiHandler = <T = any>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
) => {
  return async (request: NextRequest): Promise<NextResponse<T | ApiError>> => {
    try {
      return await handler(request);
    } catch (error) {
      return handleApiError(error);
    }
  };
};

export const getEnvVariable = (key: string, required: boolean = true): string => {
  const value = process.env[key];
  
  if (required && !value) {
    throw new ApiException(`Variable d'environnement manquante: ${key}`, 500);
  }
  
  return value || '';
};

export const parseEmailReceivers = (emailList: string): string[] => {
  if (!emailList) {
    throw new ApiException('Aucun destinataire email configuré', 500);
  }
  
  const receivers = emailList
    .split(';')
    .map(email => email.trim())
    .filter(Boolean);
  
  if (receivers.length === 0) {
    throw new ApiException('Aucun destinataire email valide configuré', 500);
  }
  
  return receivers;
};