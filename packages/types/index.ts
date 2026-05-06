// Re-export Payload-generated types here once available.
// After running `pnpm --filter @coaching/cms generate:types`,
// this file will re-export from apps/cms/src/payload-types.ts.

export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show'
  | 'failed_payment';

export type PaymentStatus =
  | 'unpaid'
  | 'paid'
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'expired'
  | 'refunded'
  | 'partially_refunded';

export type DiscountType = 'percentage' | 'fixed';

export type ApiErrorPayload = {
  error: string;
  code?: string;
};

async function postJson<TResponse>(
  path: string,
  payload: unknown,
  options?: { baseUrl?: string },
): Promise<TResponse> {
  const baseUrl = options?.baseUrl?.replace(/\/$/, '') || '';
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
    throw new Error(errorPayload?.error || `Request failed (${response.status})`);
  }

  return (await response.json()) as TResponse;
}

export function requestPasswordReset(email: string, options?: { baseUrl?: string }) {
  return postJson<{ message?: string }>(
    '/api/users/forgot-password',
    { email },
    options,
  );
}

export function resetPassword(token: string, password: string, options?: { baseUrl?: string }) {
  return postJson<{ message?: string }>(
    '/api/users/reset-password',
    { token, password },
    options,
  );
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
  options?: { baseUrl?: string },
) {
  return postJson<{ success: boolean }>(
    '/api/users/change-password',
    { currentPassword, newPassword },
    options,
  );
}
