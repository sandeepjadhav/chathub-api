import type {
  AIProvider,
  ChatRequest,
  ChatResponse,
  StreamChunk,
} from "../provider.interface.js";

export class OllamaProvider implements AIProvider {
  readonly name = "ollama";

  private readonly baseUrl: string;

  constructor(baseUrl = "http://localhost:11434") {
    this.baseUrl = baseUrl;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          stream: false,
          options: {
            temperature: request.temperature,
            num_predict: request.maxTokens,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Ollama request failed: ${response.status}`,
      );
    }

    const data = await response.json();

    return {
      content: data.message?.content ?? "",
      model: data.model ?? request.model,
      provider: this.name,
    };
  }

  async stream(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          stream: true,
          options: {
            temperature: request.temperature,
            num_predict: request.maxTokens,
          },
        }),
      },
    );

    if (!response.ok || !response.body) {
      throw new Error(
        `Ollama stream failed: ${response.status}`,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const lines = buffer.split("\n");

      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        const data = JSON.parse(line);

        onChunk({
          content: data.message?.content ?? "",
          done: Boolean(data.done),
        });
      }
    }
  }
}