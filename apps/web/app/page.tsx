'use client';

import { ChefHat, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';

const SAMPLE_PROBLEM = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`;

export default function HomePage() {
  const router = useRouter();
  const [problemText, setProblemText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startSession(text: string) {
    if (text.trim().length < 10) {
      setError('Please enter a problem statement (at least 10 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const session = await api.createSession(text.trim());
      router.push(`/session/${session.id}`);
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Failed to start session. Check your connection and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <ChefHat className="h-4 w-4" aria-hidden />
            Algorithm Thinking Coach
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            AlgoChef
          </h1>
          <p className="text-lg text-muted">Learn the recipe. Cook the solution.</p>
          <p className="mx-auto mt-4 max-w-lg text-balance text-sm text-muted-subtle">
            We do not give you code. We teach you how to think — pattern by
            pattern, step by step.
          </p>
        </header>

        <section className="panel p-6" aria-labelledby="problem-input-heading">
          <h2 id="problem-input-heading" className="sr-only">
            Enter your problem
          </h2>
          <p className="mb-1 text-sm font-medium text-foreground">
            What should I do?
          </p>
          <p className="mb-4 text-xs text-muted">
            Paste a problem below. We will guide you through understanding, patterns, and a recipe — before any code.
          </p>

          <label htmlFor="problem-text" className="mb-2 block text-sm font-medium text-zinc-300">
            Problem statement
          </label>
          <textarea
            id="problem-text"
            value={problemText}
            onChange={(e) => {
              setProblemText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste from LeetCode, Codeforces, NeetCode, or describe in plain English..."
            className="mb-4 h-48 w-full resize-none rounded-md border border-border bg-background p-4 text-sm text-zinc-300 outline-none transition-colors focus:border-accent/50"
            aria-describedby={error ? 'problem-error' : 'problem-hint'}
            aria-invalid={!!error}
          />
          <p id="problem-hint" className="sr-only">
            Minimum 10 characters required
          </p>

          {error && (
            <p id="problem-error" role="alert" className="mb-4 text-sm text-error">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => startSession(problemText)}
              loading={loading}
              disabled={!problemText.trim()}
              size="lg"
              className="flex-1"
            >
              Start Thinking
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              onClick={() => startSession(SAMPLE_PROBLEM)}
              loading={loading}
              variant="secondary"
              size="lg"
            >
              Try Two Sum
            </Button>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="sr-only">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Understand',
                desc: 'Restate the problem in plain English',
                next: 'Then observe what matters',
              },
              {
                step: '2',
                title: 'Pattern',
                desc: 'Recognize the algorithmic shape',
                next: 'Then build your recipe',
              },
              {
                step: '3',
                title: 'Recipe',
                desc: 'Cook tiny atomic reasoning steps',
                next: 'Then implement and reflect',
              },
            ].map((item) => (
              <article key={item.step} className="panel p-4">
                <span className="font-mono text-xs text-accent">{item.step}</span>
                <h3 className="mt-1 font-medium text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs text-muted">{item.desc}</p>
                <p className="mt-2 text-xs text-muted-subtle">{item.next}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
