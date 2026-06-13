'use client';

import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:bg-accent-hover disabled:hover:bg-accent shadow-sm shadow-accent/20 hover:shadow-md hover:shadow-accent/30',
  secondary:
    'border border-border bg-transparent text-foreground hover:border-accent/30 hover:text-accent hover:bg-accent/5',
  ghost:
    'bg-transparent text-muted hover:text-foreground hover:bg-surface-raised',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={clsx(
          'inline-flex items-center justify-center rounded-md font-semibold',
          'transition-all duration-fast ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="spinner" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
