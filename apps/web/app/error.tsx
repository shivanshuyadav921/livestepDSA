'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen">
      <ErrorState
        message={error.message || 'An unexpected error occurred.'}
        onRetry={reset}
      />
    </main>
  );
}
