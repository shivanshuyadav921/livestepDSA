import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { COACH_SYSTEM_PROMPT } from '@algochef/prompts';
import { z } from 'zod';
import { CompletionParams, StreamChunk } from './ai-provider.interface';
import { MockAIProvider } from './mock.provider';
import { OpenAIProvider } from './openai.provider';
import { parseAIResponse } from './schemas';

const MAX_RETRIES = 2;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private provider: {
    complete: (p: CompletionParams) => Promise<string>;
    stream: (p: CompletionParams) => AsyncGenerator<StreamChunk>;
  };

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    this.provider = apiKey ? new OpenAIProvider(config) : new MockAIProvider();
  }

  async completeJSON<T>(prompt: string, schema: z.ZodType<T>, label: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const raw = await this.provider.complete({
          system: COACH_SYSTEM_PROMPT,
          prompt,
          jsonMode: true,
        });

        const parsed = this.parseJson(raw);
        return parseAIResponse(schema, parsed, label);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        this.logger.warn(
          `AI attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (${label}): ${lastError.message}`,
        );

        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
      }
    }

    throw lastError ?? new Error(`AI failed for ${label}`);
  }

  async *streamText(prompt: string): AsyncGenerator<StreamChunk> {
    yield* this.provider.stream({
      system: COACH_SYSTEM_PROMPT,
      prompt,
      jsonMode: false,
    });
  }

  get isMockMode(): boolean {
    return !this.config.get<string>('OPENAI_API_KEY');
  }

  private parseJson(raw: string): unknown {
    try {
      return JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error('Failed to parse AI JSON response');
    }
  }
}
