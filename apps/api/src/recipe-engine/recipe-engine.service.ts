import { Injectable } from '@nestjs/common';
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
} from '@algochef/recipe-engine-core';
import { ComplexityCoach } from './complexity-coach';
import { FeedbackAnalyzer } from './feedback-analyzer';
import { HintGenerator } from './hint-generator';
import { ObservationGenerator } from './observation-generator';
import { PatternDetector } from './pattern-detector';
import { StepGenerator } from './step-generator';
import { UnderstandingGenerator } from './understanding-generator';

export interface AdvanceResult {
  stage: Stage;
  stageData: StageData;
  recipe?: RecipeCard | null;
  coachMessage: string;
}

@Injectable()
export class RecipeEngineService {
  constructor(
    private understanding: UnderstandingGenerator,
    private observations: ObservationGenerator,
    private patternDetector: PatternDetector,
    private stepGenerator: StepGenerator,
    private complexityCoach: ComplexityCoach,
    private hintGenerator: HintGenerator,
    private feedbackAnalyzer: FeedbackAnalyzer,
  ) {}

  createInitialStageData(): StageData {
    return createDefaultStageData();
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
        const understanding = await this.understanding.generate(problemText);
        updated.understanding = understanding;
        coachMessage =
          'Great. Before solving, let us notice what matters. Read the observations and answer the questions in your own words.';
        break;
      }
      case Stage.PATTERN_MATCH: {
        const understandingStr = JSON.stringify(updated.understanding ?? {});
        const obs = await this.observations.generate(problemText, understandingStr);
        updated.observations = obs;
        coachMessage =
          'What patterns do these observations suggest? We will name the pattern next — not the code.';
        break;
      }
      case Stage.CREATE_RECIPE: {
        const obsStr = JSON.stringify(updated.observations ?? []);
        const pattern = await this.patternDetector.detect(problemText, obsStr);
        updated.pattern = pattern;
        coachMessage = `I see a ${pattern.pattern} shape here. Next we will cook the recipe — one tiny step at a time.`;
        break;
      }
      case Stage.PREDICT_COMPLEXITY: {
        const patternName = updated.pattern?.pattern ?? 'Unknown';
        const generated = await this.stepGenerator.generate(problemText, patternName);
        updated.recipe = generated;
        updated.revealedSteps = 1;
        recipe = generated;
        coachMessage =
          'Your recipe is ready. Steps unlock one at a time. Study step 1 before moving on.';
        break;
      }
      case Stage.IMPLEMENT: {
        const recipeStr = JSON.stringify(updated.recipe ?? {});
        const complexity = await this.complexityCoach.coach(problemText, recipeStr);
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

  async requestHint(
    problemText: string,
    stage: Stage,
    stageData: StageData,
  ): Promise<{ hint: string; stageData: StageData }> {
    const hintNumber = stageData.hintsUsed + 1;
    const context = JSON.stringify(stageData);

    const hint = await this.hintGenerator.generate(
      problemText,
      stage,
      context,
      hintNumber,
    );

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
    return this.feedbackAnalyzer.analyze(
      problemText,
      JSON.stringify(recipe),
      code,
      language,
    );
  }

  async generateUnderstanding(problemText: string): Promise<ProblemUnderstanding> {
    return this.understanding.generate(problemText);
  }
}
