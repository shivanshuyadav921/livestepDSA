import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  AIProvider,
  CompletionParams,
  StreamChunk,
} from './ai-provider.interface';

@Injectable()
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
    this.model = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';
  }

  async complete(params: CompletionParams): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: params.system },
        { role: 'user', content: params.prompt },
      ],
      response_format: params.jsonMode ? { type: 'json_object' } : undefined,
    });

    return response.choices[0]?.message?.content ?? '';
  }

  async *stream(params: CompletionParams): AsyncGenerator<StreamChunk> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: params.system },
        { role: 'user', content: params.prompt },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? '';
      if (content) {
        yield { content, done: false };
      }
    }

    yield { content: '', done: true };
  }
}
