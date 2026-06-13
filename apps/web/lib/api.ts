const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface SessionMessage {
  id: string;
  role: string;
  content: string;
  stage: string | null;
  createdAt: string;
}

export interface SessionResponse {
  id: string;
  problemText: string;
  sourceUrl: string | null;
  currentStage: string;
  stageData: Record<string, unknown>;
  recipe: Record<string, unknown> | null;
  hintsUsed: number;
  createdAt: string;
  messages: SessionMessage[];
  latestFeedback: Record<string, unknown> | null;
}

function parseErrorMessage(body: string, status: number): string {
  try {
    const json = JSON.parse(body) as { message?: string | string[] };
    if (Array.isArray(json.message)) return json.message.join('. ');
    if (json.message) return json.message;
  } catch {
    // not JSON
  }

  if (status === 404) return 'Session not found. It may have expired.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return 'Our servers are having trouble. Please try again shortly.';
  return body || `Request failed (${status})`;
}

async function request<T>(
  path: string,
  options?: RequestInit & { retries?: number },
): Promise<T> {
  const { retries = 2, ...fetchOptions } = options ?? {};
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      const res = await fetch(`${API_URL}${path}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const body = await res.text();
        throw new ApiError(parseErrorMessage(body, res.status), res.status);
      }

      return (await res.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      const isRetryable =
        err instanceof ApiError
          ? err.status >= 500 || err.status === 429
          : err instanceof DOMException && err.name === 'AbortError';

      if (!isRetryable || attempt === retries) break;

      await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** attempt, 4000)));
    }
  }

  throw lastError ?? new Error('Request failed');
}

export const api = {
  createSession: (problemText: string, sourceUrl?: string) =>
    request<SessionResponse>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ problemText, sourceUrl }),
      retries: 1,
    }),

  getSession: (id: string) =>
    request<SessionResponse>(`/sessions/${id}`, { retries: 2 }),

  advance: (id: string) =>
    request<SessionResponse>(`/sessions/${id}/advance`, {
      method: 'POST',
      retries: 1,
    }),

  revealStep: (id: string) =>
    request<SessionResponse>(`/sessions/${id}/reveal-step`, {
      method: 'POST',
      retries: 1,
    }),

  hint: (id: string) =>
    request<{ session: SessionResponse; hint: string }>(`/sessions/${id}/hint`, {
      method: 'POST',
      retries: 1,
    }),

  submit: (id: string, code: string, language: string) =>
    request<{ submission: unknown; feedback: Record<string, unknown> }>(
      `/sessions/${id}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({ code, language }),
        retries: 1,
      },
    ),
};
