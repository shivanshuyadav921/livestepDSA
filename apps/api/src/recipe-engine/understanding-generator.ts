import { Injectable } from '@nestjs/common';
import { UNDERSTANDING_PROMPT_V1 } from '@algochef/prompts';
import { ProblemUnderstanding } from '@algochef/recipe-engine-core';
import { AiService } from '../ai/ai.service';
import { problemUnderstandingSchema } from '../ai/schemas';

@Injectable()
export class UnderstandingGenerator {
  constructor(private ai: AiService) {}

  async generate(problemText: string): Promise<ProblemUnderstanding> {
    const prompt = UNDERSTANDING_PROMPT_V1.template(problemText);
    return this.ai.completeJSON(prompt, problemUnderstandingSchema, 'understanding');
  }
}
