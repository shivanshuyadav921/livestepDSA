import { Injectable } from '@nestjs/common';
import { COMPLEXITY_COACH_PROMPT_V1 } from '@algochef/prompts';
import { ComplexityThinking } from '@algochef/recipe-engine-core';
import { AiService } from '../ai/ai.service';
import { complexityThinkingSchema } from '../ai/schemas';

@Injectable()
export class ComplexityCoach {
  constructor(private ai: AiService) {}

  async coach(problemText: string, recipe: string): Promise<ComplexityThinking> {
    const prompt = COMPLEXITY_COACH_PROMPT_V1.template(problemText, recipe);
    return this.ai.completeJSON(prompt, complexityThinkingSchema, 'complexity-coach');
  }
}
