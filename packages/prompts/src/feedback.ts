export const FEEDBACK_PROMPT_V1 = {
  name: 'feedback-analysis',
  version: 'v1',
  template: (
    problemText: string,
    recipe: string,
    code: string,
    language: string,
  ) => `Analyze this code submission as an algorithm coach.

PROBLEM:
${problemText}

RECIPE:
${recipe}

LANGUAGE: ${language}
CODE:
${code}

Respond ONLY with valid JSON:
{
  "correctness": { "status": "correct|partial|incorrect", "issues": ["issue if any"] },
  "edgeCases": ["edge case 1", "edge case 2"],
  "complexity": { "time": "O(...)", "space": "O(...)", "assessment": "brief assessment" },
  "patternChoice": { "detected": "pattern used", "fit": "how well it matches the recipe" },
  "alternatives": ["alternative approach 1"],
  "coachingNotes": ["constructive note 1", "constructive note 2"],
  "reflection": ["what to remember for next time"]
}`,
};
