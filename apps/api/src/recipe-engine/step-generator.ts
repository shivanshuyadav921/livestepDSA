import { Injectable } from '@nestjs/common';
import { RECIPE_GENERATION_PROMPT_V1 } from '@algochef/prompts';
import { RecipeCard, validateRecipeCard } from '@algochef/recipe-engine-core';
import { AiService } from '../ai/ai.service';
import { recipeCardSchema } from '../ai/schemas';

@Injectable()
export class StepGenerator {
  constructor(private ai: AiService) {}

  async generate(problemText: string, pattern: string): Promise<RecipeCard> {
    const prompt = RECIPE_GENERATION_PROMPT_V1.template(problemText, pattern);
    const recipe = await this.ai.completeJSON(prompt, recipeCardSchema, 'recipe-generation');

    const validation = validateRecipeCard(recipe);
    if (!validation.valid) {
      throw new Error(`Invalid recipe: ${validation.errors.join(', ')}`);
    }

    return recipe;
  }
}
