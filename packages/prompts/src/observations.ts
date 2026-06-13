export const OBSERVATIONS_PROMPT_V1 = {
  name: 'observation-generation',
  version: 'v1',
  template: (problemText: string, understanding: string) => `Generate observations for this problem to help the user notice important details.

PROBLEM:
${problemText}

UNDERSTANDING:
${understanding}

Respond ONLY with valid JSON:
{
  "observations": [
    { "text": "What you notice about the input/output", "question": "Socratic question to guide thinking" }
  ]
}

Rules:
- 3 to 5 observations
- No solution hints
- No code
- Focus on structure, constraints, edge cases, and relationships`,
};
