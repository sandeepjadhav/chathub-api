import { env } from "../../../../config/env.js";

import type {
  AIProvider,
  ChatRequest,
  ChatResponse,
  StreamChunk,
} from "../provider.interface.js";

interface OpenRouterStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
    finish_reason?: string | null;
  }>;
}

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter";

  private readonly baseUrl = env.openRouterBaseUrl;
  private readonly apiKey = env.openRouterApiKey;

  async chat(
    request: ChatRequest,
  ): Promise<ChatResponse> {
    const response = await fetch(
      `${this.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          max_tokens: request.maxTokens,
          stream: false,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();

      throw new Error(
        `OpenRouter request failed (${response.status}): ${error}`,
      );
    }

    const data = await response.json();

    return {
      content:
        data.choices?.[0]?.message?.content ?? "",
      model: data.model ?? request.model,
      provider: this.name,
    };
  }

  async stream(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model,
          messages: request.messages,
          temperature: request.temperature,
          max_tokens: request.maxTokens,
          stream: true,
        }),
      },
    );

    if (!response.ok || !response.body) {
      const error = await response.text();

      throw new Error(
        `OpenRouter stream failed (${response.status}): ${error}`,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } =
        await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const lines = buffer.split("\n");

      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || !trimmed.startsWith("data:")) {
          continue;
        }

        const data = trimmed
          .slice("data:".length)
          .trim();

        if (data === "[DONE]") {
          onChunk({
            content: "",
            done: true,
          });

          return;
        }

        try {
          const parsed =
            JSON.parse(data) as OpenRouterStreamChunk;

          const choice = parsed.choices?.[0];

          const content =
            choice?.delta?.content ?? "";

          const finished =
            choice?.finish_reason != null;

          onChunk({
            content,
            done: finished,
          });
        } catch {
          // Ignore malformed/incomplete SSE chunks.
        }
      }
    }
  }
}