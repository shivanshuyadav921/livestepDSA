'use client';

interface FeedbackPanelProps {
  feedback: Record<string, unknown> | null;
}

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  if (!feedback) return null;

  const correctness = feedback.correctness as {
    status?: string;
    issues?: string[];
  };
  const complexity = feedback.complexity as {
    time?: string;
    space?: string;
    assessment?: string;
  };
  const patternChoice = feedback.patternChoice as {
    detected?: string;
    fit?: string;
  };
  const coachingNotes = feedback.coachingNotes as string[] | undefined;
  const reflection = feedback.reflection as string[] | undefined;
  const edgeCases = feedback.edgeCases as string[] | undefined;

  const statusColor =
    correctness?.status === 'correct'
      ? 'text-emerald-400'
      : correctness?.status === 'partial'
        ? 'text-amber-400'
        : 'text-red-400';

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="mb-4 text-sm font-semibold">Coach Feedback</h3>

      <div className="space-y-4 text-sm">
        {correctness && (
          <div>
            <span className="text-muted">Correctness: </span>
            <span className={`font-medium capitalize ${statusColor}`}>
              {correctness.status}
            </span>
            {correctness.issues?.map((issue) => (
              <p key={issue} className="mt-1 text-zinc-400">
                • {issue}
              </p>
            ))}
          </div>
        )}

        {complexity && (
          <div>
            <p className="text-muted">Complexity</p>
            <p className="text-zinc-300">
              Time: {complexity.time} · Space: {complexity.space}
            </p>
            <p className="text-zinc-400">{complexity.assessment}</p>
          </div>
        )}

        {patternChoice && (
          <div>
            <p className="text-muted">Pattern</p>
            <p className="text-zinc-300">
              {patternChoice.detected} — {patternChoice.fit}
            </p>
          </div>
        )}

        {edgeCases && edgeCases.length > 0 && (
          <div>
            <p className="text-muted">Edge cases to consider</p>
            {edgeCases.map((ec) => (
              <p key={ec} className="text-zinc-400">
                • {ec}
              </p>
            ))}
          </div>
        )}

        {coachingNotes && coachingNotes.length > 0 && (
          <div>
            <p className="text-muted">Coaching notes</p>
            {coachingNotes.map((note) => (
              <p key={note} className="text-zinc-300">
                • {note}
              </p>
            ))}
          </div>
        )}

        {reflection && reflection.length > 0 && (
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
            <p className="mb-1 text-xs font-semibold uppercase text-accent">
              Remember
            </p>
            {reflection.map((r) => (
              <p key={r} className="text-zinc-300">
                • {r}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
