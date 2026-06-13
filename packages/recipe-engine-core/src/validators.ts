import { RecipeCard, RecipeStep } from './types';

const COMBINED_ACTION_PATTERNS = [
  /\band\b/i,
  /\bthen\b/i,
  /;/,
  /\bwhile\b.+\band\b/i,
];

const CODE_PATTERNS = [
  /```/,
  /\bfunction\b/i,
  /\breturn\b/i,
  /[{};=]/,
  /\bfor\s*\(/i,
  /\bif\s*\(/i,
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRecipeStep(step: RecipeStep): ValidationResult {
  const errors: string[] = [];
  const action = step.action.trim();

  if (!action) {
    errors.push(`Step ${step.order}: action cannot be empty`);
  }

  if (action.length > 120) {
    errors.push(`Step ${step.order}: must fit on one line (max 120 chars)`);
  }

  for (const pattern of COMBINED_ACTION_PATTERNS) {
    if (pattern.test(action)) {
      errors.push(`Step ${step.order}: must perform exactly ONE action`);
      break;
    }
  }

  for (const pattern of CODE_PATTERNS) {
    if (pattern.test(action)) {
      errors.push(`Step ${step.order}: must not contain code`);
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateRecipeCard(recipe: RecipeCard): ValidationResult {
  const errors: string[] = [];

  if (!recipe.pattern?.trim()) {
    errors.push('Recipe must have a pattern');
  }

  if (!recipe.ingredients?.length) {
    errors.push('Recipe must have at least one ingredient');
  }

  if (!recipe.steps?.length) {
    errors.push('Recipe must have at least one step');
  }

  recipe.steps?.forEach((step) => {
    const result = validateRecipeStep(step);
    errors.push(...result.errors);
  });

  const orders = recipe.steps?.map((s) => s.order) ?? [];
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    errors.push('Recipe steps must have unique order numbers');
  }

  return { valid: errors.length === 0, errors };
}

export function createDefaultStageData() {
  return {
    revealedSteps: 0,
    hintsUsed: 0,
  };
}
