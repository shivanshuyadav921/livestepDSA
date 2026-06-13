import { Injectable } from '@nestjs/common';
import { HINT_PROMPT_V1 } from '@algochef/prompts';
import { Stage } from '@algochef/recipe-engine-core';
import { AiService } from '../ai/ai.service';

@Injectable()
export class HintGenerator {
  constructor(private ai: AiService) {}

  async generate(
    problemText: string,
    stage: Stage,
    context: string,
    hintNumber: number,
  ): Promise<string> {
    const prompt = HINT_PROMPT_V1.template(
      problemText,
      stage,
      context,
      hintNumber,
    );

    const chunks: string[] = [];
    for await (const chunk of this.ai.streamText(prompt)) {
      if (chunk.content) chunks.push(chunk.content);
    }

    return chunks.join('').trim();
  }
}
