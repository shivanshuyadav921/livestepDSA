import { getNextStage } from './ladder';
import { STAGE_ORDER, Stage } from './types';
import { validateRecipeCard, validateRecipeStep } from './validators';

describe('validateRecipeStep', () => {
  it('accepts a single atomic action', () => {
    const result = validateRecipeStep({
      order: 1,
      action: 'Visit each number from left to right.',
    });
    expect(result.valid).toBe(true);
  });

  it('rejects combined actions with "and"', () => {
    const result = validateRecipeStep({
      order: 1,
      action: 'Sort the array and use two pointers.',
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('ONE action');
  });

  it('rejects code syntax', () => {
    const result = validateRecipeStep({
      order: 1,
      action: 'return the answer when found',
    });
    expect(result.valid).toBe(false);
  });

  it('rejects steps longer than 120 characters', () => {
    const result = validateRecipeStep({
      order: 1,
      action: 'a'.repeat(121),
    });
    expect(result.valid).toBe(false);
  });
});

describe('validateRecipeCard', () => {
  const validRecipe = {
    pattern: 'Hash Map Lookup',
    ingredients: ['Hash Map'],
    steps: [
      { order: 1, action: 'Start with an empty map.' },
      { order: 2, action: 'Visit each number.' },
    ],
  };

  it('accepts a valid recipe', () => {
    expect(validateRecipeCard(validRecipe).valid).toBe(true);
  });

  it('rejects missing pattern', () => {
    const result = validateRecipeCard({ ...validRecipe, pattern: '' });
    expect(result.valid).toBe(false);
  });

  it('rejects duplicate step orders', () => {
    const result = validateRecipeCard({
      ...validRecipe,
      steps: [
        { order: 1, action: 'First step here.' },
        { order: 1, action: 'Duplicate order.' },
      ],
    });
    expect(result.valid).toBe(false);
  });
});

describe('ladder FSM', () => {
  it('advances through all stages', () => {
    let stage: Stage = Stage.UNDERSTAND;
    const visited: Stage[] = [stage];

    while (getNextStage(stage)) {
      stage = getNextStage(stage)!;
      visited.push(stage);
    }

    expect(visited).toEqual(STAGE_ORDER);
  });
});
