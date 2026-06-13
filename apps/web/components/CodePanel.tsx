'use client';

import { Stage } from '@algochef/recipe-engine-core';
import { Button } from '@/components/ui/Button';

interface CodePanelProps {
  currentStage: string;
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const IMPLEMENT_STAGES = [Stage.IMPLEMENT, Stage.REFLECT];

export function CodePanel({
  currentStage,
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  loading,
}: CodePanelProps) {
  const unlocked = IMPLEMENT_STAGES.includes(currentStage as Stage);

  return (
    <section className="panel" aria-label="Code implementation">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Implementation</h2>
        <label className="sr-only" htmlFor="language-select">
          Programming language
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={!unlocked}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-zinc-300 disabled:opacity-50"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
        </select>
      </header>

      {!unlocked ? (
        <div
          className="flex h-48 items-center justify-center p-4 text-sm text-muted"
          role="status"
        >
          Code editor unlocks at the Implement stage
        </div>
      ) : (
        <>
          <label htmlFor="code-editor" className="sr-only">
            Your solution code
          </label>
          <textarea
            id="code-editor"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Write your solution here..."
            spellCheck={false}
            className="h-48 w-full resize-none bg-background p-4 font-mono text-sm text-zinc-300 outline-none"
          />
          <div className="border-t border-border p-3">
            <Button
              onClick={onSubmit}
              loading={loading}
              disabled={!code.trim()}
              className="w-full"
              aria-label="Submit code for coach feedback"
            >
              Submit for feedback
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
