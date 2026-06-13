import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  'aria-hidden'?: boolean;
}

export function Skeleton({ className, 'aria-hidden': ariaHidden = true }: SkeletonProps) {
  return (
    <div
      className={clsx('skeleton', className)}
      aria-hidden={ariaHidden}
    />
  );
}

export function SessionPageSkeleton() {
  return (
    <div className="min-h-screen animate-fade-in" aria-busy="true" aria-label="Loading session">
      <div className="border-b border-border bg-surface/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in px-6 py-20" aria-busy="true">
      <div className="mb-12 flex flex-col items-center gap-4">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );
}
