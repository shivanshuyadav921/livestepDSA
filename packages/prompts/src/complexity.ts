export const COMPLEXITY_COACH_PROMPT_V1 = {
  name: 'complexity-coach',
  version: 'v1',
  template: (problemText: string, recipe: string) => `Coach the user to think about time and space complexity.

PROBLEM:
${problemText}

RECIPE:
${recipe}

Respond ONLY with valid JSON:
{
  "timeQuestion": "Socratic question about time complexity",
  "spaceQuestion": "Socratic question about space complexity",
  "guidingNotes": ["hint about what to count", "hint about tradeoffs"]
}

Do NOT state the final Big-O answer. Guide them to discover it.`,
};
