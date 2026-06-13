import { Injectable } from '@nestjs/common';
import { PATTERN_DETECTION_PROMPT_V1 } from '@algochef/prompts';
import { PatternMatch } from '@algochef/recipe-engine-core';
import { AiService } from '../ai/ai.service';
import { patternMatchSchema } from '../ai/schemas';

@Injectable()
export class PatternDetector {
  constructor(private ai: AiService) {}

  async detect(problemText: string, observations: string): Promise<PatternMatch> {
    const prompt = PATTERN_DETECTION_PROMPT_V1.template(problemText, observations);
    return this.ai.completeJSON(prompt, patternMatchSchema, 'pattern-detection');
  }
}
