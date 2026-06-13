export const UNDERSTANDING_PROMPT_V1 = {
  name: 'problem-understanding',
  version: 'v1',
  template: (problemText: string) => `Analyze this algorithmic problem and help the user understand it.

PROBLEM:
${problemText}

Respond ONLY with valid JSON in this exact shape:
{
  "restatement": "Plain English restatement of what we're solving",
  "constraints": ["constraint 1", "constraint 2"],
  "examples": ["example 1 walkthrough", "example 2 walkthrough"],
  "goal": "One sentence: what success looks like"
}

Do NOT include code. Do NOT reveal the solution approach.`,
};
