'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  showHomeLink = true,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-error/30 bg-error/10">
        <AlertCircle className="h-6 w-6 text-error" aria-hidden />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted">{message}</p>
      </div>
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="primary" size="md">
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
        )}
        {showHomeLink && (
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
          >
            Go home
          </Link>
        )}
      </div>
    </div>
  );
}
