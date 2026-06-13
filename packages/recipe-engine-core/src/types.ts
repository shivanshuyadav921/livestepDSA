export enum Stage {
  UNDERSTAND = 'UNDERSTAND',
  OBSERVE = 'OBSERVE',
  PATTERN_MATCH = 'PATTERN_MATCH',
  CREATE_RECIPE = 'CREATE_RECIPE',
  PREDICT_COMPLEXITY = 'PREDICT_COMPLEXITY',
  IMPLEMENT = 'IMPLEMENT',
  REFLECT = 'REFLECT',
}

export const STAGE_ORDER: Stage[] = [
  Stage.UNDERSTAND,
  Stage.OBSERVE,
  Stage.PATTERN_MATCH,
  Stage.CREATE_RECIPE,
  Stage.PREDICT_COMPLEXITY,
  Stage.IMPLEMENT,
  Stage.REFLECT,
];

export interface RecipeStep {
  order: number;
  action: string;
  hint?: string;
}

export interface RecipeCard {
  pattern: string;
  ingredients: string[];
  steps: RecipeStep[];
  complexity?: {
    time: string;
    space: string;
    explanation: string;
  };
}

export interface ProblemUnderstanding {
  restatement: string;
  constraints: string[];
  examples: string[];
  goal: string;
}

export interface Observation {
  text: string;
  question?: string;
}

export interface PatternMatch {
  pattern: string;
  category: string;
  reasoning: string;
  signals: string[];
}

export interface ComplexityThinking {
  timeQuestion: string;
  spaceQuestion: string;
  guidingNotes: string[];
}

export interface FeedbackResult {
  correctness: {
    status: 'correct' | 'partial' | 'incorrect';
    issues: string[];
  };
  edgeCases: string[];
  complexity: {
    time: string;
    space: string;
    assessment: string;
  };
  patternChoice: {
    detected: string;
    fit: string;
  };
  alternatives: string[];
  coachingNotes: string[];
  reflection: string[];
}

export interface StageData {
  understanding?: ProblemUnderstanding;
  observations?: Observation[];
  pattern?: PatternMatch;
  recipe?: RecipeCard;
  complexity?: ComplexityThinking;
  revealedSteps: number;
  hintsUsed: number;
}

export interface SessionState {
  id: string;
  problemText: string;
  sourceUrl?: string | null;
  currentStage: Stage;
  stageData: StageData;
  recipe?: RecipeCard | null;
}
