import { messageRepository } from "../messages/message.repository.js";
import { messageService } from "../messages/message.service.js";
import { conversationRepository } from "../conversations/conversation.repository.js";
import { providerService } from "../providers/provider.service.js";
import { providerRegistry } from "../ai/providers/provider.registry.js";
import { MessageRole } from "../messages/message.entity.js";

import type { SendMessageRequest } from "./chat.types.js";

export class ChatService {
  async streamMessage(
    userId: string,
    conversationId: string,
    request: SendMessageRequest,
    onChunk: (content: string) => void,
  ) {
    const conversation =
      await conversationRepository.findOne({
        where: {
          id: conversationId,
          userId,
        },
      });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const providerId =
      request.providerId ?? conversation.providerId;

    const modelId =
      request.modelId ?? conversation.modelId;

    if (!providerId || !modelId) {
      throw new Error(
        "Provider and model must be selected",
      );
    }

    const { provider, model } =
      await providerService.getEnabledProviderWithModel(
        providerId,
        modelId,
      );

    const aiProvider =
      providerRegistry.get(provider.name);

    const nextSequence =
      await messageService.getNextSequence(
        conversation.id,
      );

    const userMessage =
      messageRepository.create({
        conversationId: conversation.id,
        role: MessageRole.USER,
        content: request.content,
        providerId: provider.id,
        modelId: model.id,
        sequence: nextSequence,
      });

    await messageRepository.save(userMessage);

    const history =
      await messageService.listByConversation(
        conversation.id,
      );

    const assistantSequence =
      nextSequence + 1;

    let assistantContent = "";

    await aiProvider.stream(
      {
        model: model.name,

        messages: history.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      },

      (chunk) => {
        if (chunk.content) {
          assistantContent += chunk.content;

          onChunk(chunk.content);
        }
      },
    );

    const assistantMessage =
      messageRepository.create({
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: assistantContent,
        providerId: provider.id,
        modelId: model.id,
        sequence: assistantSequence,
      });

    await messageRepository.save(
      assistantMessage,
    );

    conversation.providerId = provider.id;
    conversation.modelId = model.id;

    await conversationRepository.save(
      conversation,
    );

    return assistantMessage;
  }
}

export const chatService =
  new ChatService();
  