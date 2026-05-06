import { Suspense } from 'react';
import { LoginClient } from './login-client';

const fallback = (
  <div className="flex min-h-screen items-center justify-center bg-white text-sm text-black/40">
    Chargement…
  </div>
);

export default function LoginPage() {
  return (
    <Suspense fallback={fallback}>
      <LoginClient />
    </Suspense>
  );
}
