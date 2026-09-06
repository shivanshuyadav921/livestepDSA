import OpenAI from 'openai';
import {
  AIProvider,
  CompletionParams,
  StreamChunk,
} from './ai-provider.interface';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
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
