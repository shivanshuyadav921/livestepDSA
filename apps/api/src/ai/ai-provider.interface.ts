export interface CompletionParams {
  system: string;
  prompt: string;
  jsonMode?: boolean;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface AIProvider {
  complete(params: CompletionParams): Promise<string>;
  stream(params: CompletionParams): AsyncGenerator<StreamChunk>;
}
