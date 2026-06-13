export const RECIPE_GENERATION_PROMPT_V1 = {
  name: 'recipe-generation',
  version: 'v1',
  template: (problemText: string, pattern: string) => `Convert this problem into an AlgoChef Recipe.

PROBLEM:
${problemText}

DETECTED PATTERN:
${pattern}

Respond ONLY with valid JSON:
{
  "pattern": "Pattern name",
  "ingredients": ["data structure or observation 1", "ingredient 2"],
  "steps": [
    { "order": 1, "action": "One atomic mental action", "hint": "Optional micro-hint" }
  ]
}

RECIPE RULES:
- Each step performs exactly ONE action
- Each step fits on one line
- Beginner-friendly language
- Never skip reasoning
- Never combine multiple operations (no "and", no "then")
- No code syntax
- 4 to 8 steps`,
};
