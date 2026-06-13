import { Injectable } from '@nestjs/common';
import { FEEDBACK_PROMPT_V1 } from '@algochef/prompts';
import { FeedbackResult } from '@algochef/recipe-engine-core';
import { AiService } from '../ai/ai.service';
import { feedbackResultSchema } from '../ai/schemas';

@Injectable()
export class FeedbackAnalyzer {
  constructor(private ai: AiService) {}

  async analyze(
    problemText: string,
    recipe: string,
    code: string,
    language: string,
  ): Promise<FeedbackResult> {
    const prompt = FEEDBACK_PROMPT_V1.template(
      problemText,
      recipe,
      code,
      language,
    );
    return this.ai.completeJSON(prompt, feedbackResultSchema, 'feedback-analysis');
  }
}
