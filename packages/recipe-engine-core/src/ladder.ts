import { STAGE_ORDER, Stage } from './types';

export function getNextStage(current: Stage): Stage | null {
  const index = STAGE_ORDER.indexOf(current);
  if (index === -1 || index === STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[index + 1];
}

export function getPreviousStage(current: Stage): Stage | null {
  const index = STAGE_ORDER.indexOf(current);
  if (index <= 0) return null;
  return STAGE_ORDER[index - 1];
}

export function getStageIndex(stage: Stage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function getStageLabel(stage: Stage): string {
  const labels: Record<Stage, string> = {
    [Stage.UNDERSTAND]: 'Understand',
    [Stage.OBSERVE]: 'Observe',
    [Stage.PATTERN_MATCH]: 'Pattern Match',
    [Stage.CREATE_RECIPE]: 'Create Recipe',
    [Stage.PREDICT_COMPLEXITY]: 'Predict Complexity',
    [Stage.IMPLEMENT]: 'Implement',
    [Stage.REFLECT]: 'Reflect',
  };
  return labels[stage];
}

export function canAdvanceFrom(stage: Stage): boolean {
  return getNextStage(stage) !== null;
}

export const STAGE_GUARDRAILS: Record<
  Stage,
  { allowCode: boolean; maxReveal: string }
> = {
  [Stage.UNDERSTAND]: { allowCode: false, maxReveal: 'problem_restatement' },
  [Stage.OBSERVE]: { allowCode: false, maxReveal: 'observations' },
  [Stage.PATTERN_MATCH]: { allowCode: false, maxReveal: 'pattern_name_only' },
  [Stage.CREATE_RECIPE]: { allowCode: false, maxReveal: 'one_step_at_a_time' },
  [Stage.PREDICT_COMPLEXITY]: { allowCode: false, maxReveal: 'questions_only' },
  [Stage.IMPLEMENT]: { allowCode: true, maxReveal: 'hints_only' },
  [Stage.REFLECT]: { allowCode: true, maxReveal: 'full_feedback' },
};
