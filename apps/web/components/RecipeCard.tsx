'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChefHat, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getMotionTransition } from '@/lib/motion';

interface RecipeStep {
  order: number;
  action: string;
  hint?: string;
}

interface RecipeCardProps {
  pattern?: string;
  ingredients?: string[];
  steps?: RecipeStep[];
  revealedSteps: number;
  onRevealStep?: () => void;
  loading?: boolean;
}

export function RecipeCard({
  pattern,
  ingredients = [],
  steps = [],
  revealedSteps,
  onRevealStep,
  loading,
}: RecipeCardProps) {
  const reducedMotion = useReducedMotion();

  if (!pattern && steps.length === 0) {
    return (
      <div className="panel p-6" aria-label="Recipe card locked">
        <div className="flex items-center gap-2 text-muted">
          <ChefHat className="h-5 w-5" aria-hidden />
          <span className="text-sm">Recipe unlocks as you climb the ladder</span>
        </div>
      </div>
    );
  }

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={getMotionTransition(!!reducedMotion)}
      className="rounded-lg border border-accent/20 bg-surface p-6 shadow-lg shadow-accent/5"
      aria-label="Recipe card"
    >
      <header className="mb-4 flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          🍳
        </span>
        <div>
          <h2 className="font-semibold text-foreground">Recipe Card</h2>
          {pattern && (
            <p className="text-sm text-accent">
              Pattern: <span className="font-medium">{pattern}</span>
            </p>
          )}
        </div>
      </header>

      {ingredients.length > 0 && (
        <section className="mb-5" aria-labelledby="ingredients-heading">
          <h3
            id="ingredients-heading"
            className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Ingredients
          </h3>
          <ul className="space-y-1" role="list">
            {ingredients.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-zinc-300">
                <span className="text-accent" aria-hidden>
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {steps.length > 0 && (
        <section aria-labelledby="recipe-steps-heading">
          <h3
            id="recipe-steps-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Recipe
          </h3>
          <ol className="space-y-2" role="list">
            {steps.map((step) => {
              const isRevealed = step.order <= revealedSteps;

              return (
                <li
                  key={step.order}
                  className={`flex gap-3 rounded-md border p-3 text-sm ${
                    isRevealed
                      ? 'border-border bg-background text-zinc-200'
                      : 'border-border/50 bg-background/50 text-muted'
                  }`}
                  aria-label={
                    isRevealed
                      ? `Step ${step.order}: ${step.action}`
                      : `Step ${step.order}: locked`
                  }
                >
                  <span className="font-mono text-accent" aria-hidden>
                    {step.order}.
                  </span>
                  {isRevealed ? (
                    <span>{step.action}</span>
                  ) : (
                    <span className="flex items-center gap-2 italic">
                      <Lock className="h-3 w-3" aria-hidden />
                      Locked — keep climbing
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          {revealedSteps < steps.length && onRevealStep && (
            <Button
              onClick={onRevealStep}
              loading={loading}
              variant="secondary"
              size="md"
              className="mt-4 w-full border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
              aria-label="Reveal next recipe step"
            >
              Reveal next step
            </Button>
          )}
        </section>
      )}
    </motion.article>
  );
}
