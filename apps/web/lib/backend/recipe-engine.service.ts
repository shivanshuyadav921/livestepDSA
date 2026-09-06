import {
  COMPLEXITY_COACH_PROMPT_V1,
  FEEDBACK_PROMPT_V1,
  HINT_PROMPT_V1,
  OBSERVATIONS_PROMPT_V1,
  PATTERN_DETECTION_PROMPT_V1,
  RECIPE_GENERATION_PROMPT_V1,
  UNDERSTANDING_PROMPT_V1,
} from '@algochef/prompts';
import {
  ComplexityThinking,
  FeedbackResult,
  Observation,
  PatternMatch,
  ProblemUnderstanding,
  RecipeCard,
  Stage,
  StageData,
  createDefaultStageData,
  getNextStage,
  validateRecipeCard,
} from '@algochef/recipe-engine-core';
import { aiService } from './ai.service';
import {
  complexityThinkingSchema,
  feedbackResultSchema,
  observationsResponseSchema,
  patternMatchSchema,
  recipeCardSchema,
  problemUnderstandingSchema,
} from './schemas';

export interface AdvanceResult {
  stage: Stage;
  stageData: StageData;
  recipe?: RecipeCard | null;
  coachMessage: string;
}

export class RecipeEngineService {
  createInitialStageData(): StageData {
    return createDefaultStageData();
  }

  async generateUnderstanding(problemText: string): Promise<ProblemUnderstanding> {
    const prompt = UNDERSTANDING_PROMPT_V1.template(problemText);
    return aiService.completeJSON(prompt, problemUnderstandingSchema, 'understanding');
  }

  async generateObservations(problemText: string, understanding: string): Promise<Observation[]> {
    const prompt = OBSERVATIONS_PROMPT_V1.template(problemText, understanding);
    const result = await aiService.completeJSON(
      prompt,
      observationsResponseSchema,
      'observations',
    );
    return result.observations;
  }

  async detectPattern(problemText: string, observations: string): Promise<PatternMatch> {
    const prompt = PATTERN_DETECTION_PROMPT_V1.template(problemText, observations);
    return aiService.completeJSON(prompt, patternMatchSchema, 'pattern-detection');
  }

  async generateSteps(problemText: string, pattern: string): Promise<RecipeCard> {
    const prompt = RECIPE_GENERATION_PROMPT_V1.template(problemText, pattern);
    const recipe = await aiService.completeJSON(prompt, recipeCardSchema, 'recipe-generation');

    const validation = validateRecipeCard(recipe);
    if (!validation.valid) {
      throw new Error(`Invalid recipe: ${validation.errors.join(', ')}`);
    }

    return recipe;
  }

  async coachComplexity(problemText: string, recipe: string): Promise<ComplexityThinking> {
    const prompt = COMPLEXITY_COACH_PROMPT_V1.template(problemText, recipe);
    return aiService.completeJSON(prompt, complexityThinkingSchema, 'complexity-coach');
  }

  async requestHint(
    problemText: string,
    stage: Stage,
    stageData: StageData,
  ): Promise<{ hint: string; stageData: StageData }> {
    const hintNumber = stageData.hintsUsed + 1;
    const context = JSON.stringify(stageData);

    const prompt = HINT_PROMPT_V1.template(
      problemText,
      stage,
      context,
      hintNumber,
    );

    const chunks: string[] = [];
    for await (const chunk of aiService.streamText(prompt)) {
      if (chunk.content) chunks.push(chunk.content);
    }

    const hint = chunks.join('').trim();

    return {
      hint,
      stageData: { ...stageData, hintsUsed: hintNumber },
    };
  }

  async analyzeSubmission(
    problemText: string,
    recipe: RecipeCard,
    code: string,
    language: string,
  ): Promise<FeedbackResult> {
    const prompt = FEEDBACK_PROMPT_V1.template(
      problemText,
      JSON.stringify(recipe),
      code,
      language,
    );
    return aiService.completeJSON(prompt, feedbackResultSchema, 'feedback-analysis');
  }

  async advanceStage(
    problemText: string,
    currentStage: Stage,
    stageData: StageData,
  ): Promise<AdvanceResult> {
    const nextStage = getNextStage(currentStage);
    if (!nextStage) {
      return {
        stage: currentStage,
        stageData,
        recipe: stageData.recipe ?? null,
        coachMessage: 'You have completed the Thinking Ladder for this problem.',
      };
    }

    const updated = { ...stageData };
    let coachMessage = '';
    let recipe: RecipeCard | null | undefined = stageData.recipe;

    switch (nextStage) {
      case Stage.OBSERVE: {
        const understanding = await this.generateUnderstanding(problemText);
        updated.understanding = understanding;
        coachMessage =
          'Great. Before solving, let us notice what matters. Read the observations and answer the questions in your own words.';
        break;
      }
      case Stage.PATTERN_MATCH: {
        const understandingStr = JSON.stringify(updated.understanding ?? {});
        const obs = await this.generateObservations(problemText, understandingStr);
        updated.observations = obs;
        coachMessage =
          'What patterns do these observations suggest? We will name the pattern next — not the code.';
        break;
      }
      case Stage.CREATE_RECIPE: {
        const obsStr = JSON.stringify(updated.observations ?? []);
        const pattern = await this.detectPattern(problemText, obsStr);
        updated.pattern = pattern;
        coachMessage = `I see a ${pattern.pattern} shape here. Next we will cook the recipe — one tiny step at a time.`;
        break;
      }
      case Stage.PREDICT_COMPLEXITY: {
        const patternName = updated.pattern?.pattern ?? 'Unknown';
        const generated = await this.generateSteps(problemText, patternName);
        updated.recipe = generated;
        updated.revealedSteps = 1;
        recipe = generated;
        coachMessage =
          'Your recipe is ready. Steps unlock one at a time. Study step 1 before moving on.';
        break;
      }
      case Stage.IMPLEMENT: {
        const recipeStr = JSON.stringify(updated.recipe ?? {});
        const complexity = await this.coachComplexity(problemText, recipeStr);
        updated.complexity = complexity;
        coachMessage =
          'Before coding: what is the time cost? What is the space cost? Answer the complexity questions first.';
        break;
      }
      case Stage.REFLECT: {
        coachMessage =
          'Implementation stage unlocked. Write your solution, then submit for coaching feedback.';
        break;
      }
      default:
        coachMessage = 'Keep going — you are building real algorithmic thinking.';
    }

    return {
      stage: nextStage,
      stageData: updated,
      recipe: recipe ?? updated.recipe ?? null,
      coachMessage,
    };
  }

  async revealNextStep(stageData: StageData): Promise<StageData> {
    const recipe = stageData.recipe;
    if (!recipe) return stageData;

    const maxSteps = recipe.steps.length;
    const next = Math.min(stageData.revealedSteps + 1, maxSteps);

    return { ...stageData, revealedSteps: next };
  }
}

export const recipeEngineService = new RecipeEngineService();
