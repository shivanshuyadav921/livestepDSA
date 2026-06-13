export const PATTERN_DETECTION_PROMPT_V1 = {
  name: 'pattern-detection',
  version: 'v1',
  template: (problemText: string, observations: string) => `Identify the algorithmic pattern for this problem WITHOUT revealing the solution.

PROBLEM:
${problemText}

OBSERVATIONS:
${observations}

Respond ONLY with valid JSON:
{
  "pattern": "Human-readable pattern name (e.g. Hash Map Lookup)",
  "category": "Category (e.g. TWO_POINTERS, SLIDING_WINDOW, HASH_MAP, DFS, BFS, DP, etc.)",
  "reasoning": "Why this pattern fits — mental model only, no code",
  "signals": ["signal 1 that triggered this pattern", "signal 2"]
}

Do NOT include code. Do NOT list implementation steps.`,
};
