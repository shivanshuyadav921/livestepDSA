'use client';

import { Stage, getNextStage, getStageLabel } from '@algochef/recipe-engine-core';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { SessionPageSkeleton } from '@/components/ui/Skeleton';
import { api, ApiError, type SessionResponse } from '@/lib/api';

const CoachPanel = dynamic(
  () => import('@/components/CoachPanel').then((m) => m.CoachPanel),
  { ssr: false },
);
const RecipeCard = dynamic(
  () => import('@/components/RecipeCard').then((m) => m.RecipeCard),
  { ssr: false },
);
const ProblemPanel = dynamic(
  () => import('@/components/ProblemPanel').then((m) => m.ProblemPanel),
  { ssr: false },
);
const CodePanel = dynamic(
  () => import('@/components/CodePanel').then((m) => m.CodePanel),
  { ssr: false },
);
const FeedbackPanel = dynamic(
  () => import('@/components/FeedbackPanel').then((m) => m.FeedbackPanel),
  { ssr: false },
);
const ThinkingLadder = dynamic(
  () => import('@/components/ThinkingLadder').then((m) => m.ThinkingLadder),
  { ssr: false },
);

type LoadState = 'loading' | 'ready' | 'error' | 'not-found';

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [feedback, setFeedback] = useState<Record<string, unknown> | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const data = await api.getSession(sessionId);
      setSession(data);
      if (data.latestFeedback) setFeedback(data.latestFeedback);
      setLoadState('ready');
      setErrorMessage('');
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setLoadState('not-found');
      } else {
        setLoadState('error');
        setErrorMessage(
          e instanceof ApiError
            ? e.message
            : 'Could not load your session. Check your connection.',
        );
      }
    }
  }, [sessionId]);

  useEffect(() => {
    setLoadState('loading');
    loadSession();
  }, [loadSession]);

  async function runAction(action: () => Promise<void>) {
    setActionLoading(true);
    setErrorMessage('');
    try {
      await action();
    } catch (e) {
      setErrorMessage(
        e instanceof ApiError
          ? e.message
          : 'Action failed. Your progress is saved — try again.',
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loadState === 'loading') return <SessionPageSkeleton />;

  if (loadState === 'not-found') {
    return (
      <main className="min-h-screen">
        <ErrorState
          title="Session not found"
          message="This coaching session does not exist or may have expired."
          showHomeLink
        />
      </main>
    );
  }

  if (loadState === 'error' || !session) {
    return (
      <main className="min-h-screen">
        <ErrorState message={errorMessage} onRetry={loadSession} />
      </main>
    );
  }

  const stageData = session.stageData as {
    understanding?: {
      restatement?: string;
      constraints?: string[];
      examples?: string[];
      goal?: string;
    };
    observations?: { text: string; question?: string }[];
    pattern?: { pattern?: string; reasoning?: string; signals?: string[] };
    complexity?: {
      timeQuestion?: string;
      spaceQuestion?: string;
      guidingNotes?: string[];
    };
    revealedSteps?: number;
  };

  const recipe = session.recipe as {
    pattern?: string;
    ingredients?: string[];
    steps?: { order: number; action: string }[];
  } | null;

  const canAdvance = getNextStage(session.currentStage as Stage) !== null;
  const nextStage = canAdvance
    ? getNextStage(session.currentStage as Stage)
    : null;

  return (
    <main id="main-content" className="min-h-screen">
      <header className="border-b border-border bg-surface/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted transition-colors duration-fast hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            AlgoChef
          </Link>
          <p className="hidden text-xs text-muted sm:block">
            Learn the recipe. Cook the solution.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
          >
            {errorMessage}
          </div>
        )}

        <div className="mb-6">
          <ThinkingLadder currentStage={session.currentStage} />
        </div>

        {canAdvance && session.currentStage !== Stage.REFLECT && (
          <div className="mb-6 flex items-center justify-between rounded-md border border-border bg-surface p-4">
            <div>
              <p className="text-sm font-medium text-foreground">What happens next?</p>
              <p className="text-xs text-muted">
                Advance to{' '}
                <span className="text-accent">
                  {nextStage ? getStageLabel(nextStage) : ''}
                </span>{' '}
                when you are ready.
              </p>
            </div>
            <Button
              onClick={() => runAction(async () => {
                await api.advance(sessionId);
                await loadSession();
              })}
              loading={actionLoading}
              aria-label="Advance to next thinking stage"
            >
              Next stage
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="panel p-6">
              <ProblemPanel
                problemText={session.problemText}
                understanding={stageData.understanding}
                observations={stageData.observations}
                pattern={stageData.pattern}
                complexity={stageData.complexity}
              />
            </div>

            <CodePanel
              currentStage={session.currentStage}
              code={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              onSubmit={() =>
                runAction(async () => {
                  const result = await api.submit(sessionId, code, language);
                  setFeedback(result.feedback);
                  await loadSession();
                })
              }
              loading={actionLoading}
            />

            <FeedbackPanel feedback={feedback} />
          </div>

          <div className="space-y-6">
            <RecipeCard
              pattern={recipe?.pattern}
              ingredients={recipe?.ingredients}
              steps={recipe?.steps}
              revealedSteps={stageData.revealedSteps ?? 0}
              loading={actionLoading}
              onRevealStep={() =>
                runAction(async () => {
                  await api.revealStep(sessionId);
                  await loadSession();
                })
              }
            />

            <div className="h-[400px]">
              <CoachPanel
                messages={session.messages}
                onHint={() =>
                  runAction(async () => {
                    await api.hint(sessionId);
                    await loadSession();
                  })
                }
                hintsUsed={session.hintsUsed}
                loading={actionLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
