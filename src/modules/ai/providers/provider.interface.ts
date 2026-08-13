export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface AIProvider {
  readonly name: string;

  chat(request: ChatRequest): Promise<ChatResponse>;

  stream(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
  ): Promise<void>;
}
