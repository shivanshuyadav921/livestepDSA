import { Injectable } from '@nestjs/common';
import { OBSERVATIONS_PROMPT_V1 } from '@algochef/prompts';
import { Observation } from '@algochef/recipe-engine-core';
import { AiService } from '../ai/ai.service';
import { observationsResponseSchema } from '../ai/schemas';

@Injectable()
export class ObservationGenerator {
  constructor(private ai: AiService) {}

  async generate(
    problemText: string,
    understanding: string,
  ): Promise<Observation[]> {
    const prompt = OBSERVATIONS_PROMPT_V1.template(problemText, understanding);
    const result = await this.ai.completeJSON(
      prompt,
      observationsResponseSchema,
      'observations',
    );
    return result.observations;
  }
}
