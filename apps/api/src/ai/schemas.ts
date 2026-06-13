import { z } from 'zod';

export const problemUnderstandingSchema = z.object({
  restatement: z.string().min(1),
  constraints: z.array(z.string()).min(1),
  examples: z.array(z.string()).min(1),
  goal: z.string().min(1),
});

export const observationSchema = z.object({
  text: z.string().min(1),
  question: z.string().optional(),
});

export const observationsResponseSchema = z.object({
  observations: z.array(observationSchema).min(3).max(6),
});

export const patternMatchSchema = z.object({
  pattern: z.string().min(1),
  category: z.string().min(1),
  reasoning: z.string().min(1),
  signals: z.array(z.string()).min(1),
});

export const recipeStepSchema = z.object({
  order: z.number().int().positive(),
  action: z.string().min(1).max(120),
  hint: z.string().optional(),
});

export const recipeCardSchema = z.object({
  pattern: z.string().min(1),
  ingredients: z.array(z.string()).min(1),
  steps: z.array(recipeStepSchema).min(4).max(10),
});

export const complexityThinkingSchema = z.object({
  timeQuestion: z.string().min(1),
  spaceQuestion: z.string().min(1),
  guidingNotes: z.array(z.string()).min(1),
});

export const feedbackResultSchema = z.object({
  correctness: z.object({
    status: z.enum(['correct', 'partial', 'incorrect']),
    issues: z.array(z.string()),
  }),
  edgeCases: z.array(z.string()),
  complexity: z.object({
    time: z.string().min(1),
    space: z.string().min(1),
    assessment: z.string().min(1),
  }),
  patternChoice: z.object({
    detected: z.string().min(1),
    fit: z.string().min(1),
  }),
  alternatives: z.array(z.string()),
  coachingNotes: z.array(z.string()).min(1),
  reflection: z.array(z.string()).min(1),
});

export function parseAIResponse<T>(schema: z.ZodType<T>, raw: unknown, label: string): T {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `AI response validation failed (${label}): ${result.error.issues.map((i) => i.message).join(', ')}`,
    );
  }
  return result.data;
}
