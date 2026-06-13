'use client';

import { STAGE_ORDER, Stage, getStageLabel } from '@algochef/recipe-engine-core';
import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getMotionTransition, getStaggerDelay } from '@/lib/motion';

interface ThinkingLadderProps {
  currentStage: string;
}

export function ThinkingLadder({ currentStage }: ThinkingLadderProps) {
  const reducedMotion = useReducedMotion();
  const currentIndex = STAGE_ORDER.indexOf(currentStage as Stage);
  const transition = getMotionTransition(!!reducedMotion);

  return (
    <nav aria-label="Thinking ladder progress">
      <ol className="flex flex-wrap gap-2" role="list">
        {STAGE_ORDER.map((stage, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={stage}>
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: getStaggerDelay(!!reducedMotion, index) }}
                aria-current={isCurrent ? 'step' : undefined}
                className={clsx(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-fast',
                  isComplete && 'border-success/30 bg-success/10 text-success',
                  isCurrent && 'border-accent/50 bg-accent/10 text-accent',
                  !isComplete && !isCurrent && 'border-border bg-surface text-muted',
                )}
              >
                {isComplete ? (
                  <Check className="h-3 w-3" aria-hidden />
                ) : (
                  <span className="font-mono" aria-hidden>
                    {index + 1}
                  </span>
                )}
                <span>{getStageLabel(stage)}</span>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
