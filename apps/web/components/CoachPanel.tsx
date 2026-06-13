'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getMotionTransition, getStaggerDelay } from '@/lib/motion';
import type { SessionMessage } from '@/lib/api';

interface CoachPanelProps {
  messages: SessionMessage[];
  onHint: () => void;
  hintsUsed: number;
  loading?: boolean;
}

export function CoachPanel({
  messages,
  onHint,
  hintsUsed,
  loading,
}: CoachPanelProps) {
  const reducedMotion = useReducedMotion();
  const coachMessages = messages.filter((m) => m.role === 'coach');
  const transition = getMotionTransition(!!reducedMotion);

  return (
    <section
      className="flex h-full flex-col rounded-lg border border-border bg-surface"
      aria-label="Coach conversation"
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-accent" aria-hidden />
          <h2 className="text-sm font-medium">Coach</h2>
        </div>
        <Button
          onClick={onHint}
          disabled={loading}
          loading={loading}
          variant="secondary"
          size="sm"
          aria-label={`Request a hint. ${hintsUsed} hints used so far.`}
        >
          Hint ({hintsUsed})
        </Button>
      </header>

      <div
        className="flex-1 space-y-3 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {coachMessages.length === 0 ? (
          <p className="text-sm text-muted">
            Your coach will guide you through each stage. Click &quot;Next stage&quot; to begin.
          </p>
        ) : (
          coachMessages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={reducedMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transition, delay: getStaggerDelay(!!reducedMotion, i) }}
              className="rounded-md border border-border bg-background p-3 text-sm leading-relaxed text-zinc-300"
            >
              {msg.content}
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
