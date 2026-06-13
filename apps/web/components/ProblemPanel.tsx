'use client';

interface ProblemPanelProps {
  problemText: string;
  understanding?: {
    restatement?: string;
    constraints?: string[];
    examples?: string[];
    goal?: string;
  };
  observations?: { text: string; question?: string }[];
  pattern?: {
    pattern?: string;
    reasoning?: string;
    signals?: string[];
  };
  complexity?: {
    timeQuestion?: string;
    spaceQuestion?: string;
    guidingNotes?: string[];
  };
}

export function ProblemPanel({
  problemText,
  understanding,
  observations,
  pattern,
  complexity,
}: ProblemPanelProps) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Problem
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
          {problemText}
        </p>
      </section>

      {understanding && (
        <section className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            Understanding
          </h3>
          {understanding.restatement && (
            <p className="mb-3 text-sm text-zinc-300">{understanding.restatement}</p>
          )}
          {understanding.goal && (
            <p className="mb-3 text-sm text-zinc-400">
              <span className="text-zinc-500">Goal: </span>
              {understanding.goal}
            </p>
          )}
          {understanding.constraints && understanding.constraints.length > 0 && (
            <ul className="mb-3 space-y-1">
              {understanding.constraints.map((c) => (
                <li key={c} className="text-sm text-zinc-400">
                  • {c}
                </li>
              ))}
            </ul>
          )}
          {understanding.examples && understanding.examples.length > 0 && (
            <div className="space-y-1">
              {understanding.examples.map((ex) => (
                <p key={ex} className="font-mono text-xs text-zinc-500">
                  {ex}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {observations && observations.length > 0 && (
        <section className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
            Observations
          </h3>
          <div className="space-y-3">
            {observations.map((obs) => (
              <div key={obs.text}>
                <p className="text-sm text-zinc-300">{obs.text}</p>
                {obs.question && (
                  <p className="mt-1 text-sm italic text-zinc-500">{obs.question}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {pattern && (
        <section className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            Pattern
          </h3>
          <p className="text-sm font-medium text-zinc-200">{pattern.pattern}</p>
          {pattern.reasoning && (
            <p className="mt-2 text-sm text-zinc-400">{pattern.reasoning}</p>
          )}
          {pattern.signals && (
            <ul className="mt-2 space-y-1">
              {pattern.signals.map((s) => (
                <li key={s} className="text-xs text-zinc-500">
                  ↳ {s}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {complexity && (
        <section className="rounded-lg border border-border bg-surface p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
            Complexity Thinking
          </h3>
          {complexity.timeQuestion && (
            <p className="mb-2 text-sm text-zinc-300">{complexity.timeQuestion}</p>
          )}
          {complexity.spaceQuestion && (
            <p className="mb-2 text-sm text-zinc-300">{complexity.spaceQuestion}</p>
          )}
          {complexity.guidingNotes?.map((note) => (
            <p key={note} className="text-xs text-zinc-500">
              • {note}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
