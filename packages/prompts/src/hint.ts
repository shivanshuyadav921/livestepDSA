export const HINT_PROMPT_V1 = {
  name: 'progressive-hint',
  version: 'v1',
  template: (
    problemText: string,
    stage: string,
    context: string,
    hintNumber: number,
  ) => `Provide hint #${hintNumber} for a user working on this problem.

STAGE: ${stage}
PROBLEM: ${problemText}
CONTEXT: ${context}

Rules:
- One small hint only
- Socratic when possible
- Never reveal full solution
- Never include code
- Max 2 sentences`,
};
