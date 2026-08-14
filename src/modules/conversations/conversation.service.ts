import { conversationRepository } from "./conversation.repository.js";
import type {
  CreateConversationRequest,
  UpdateConversationRequest,
} from "./conversation.types.js";

export class ConversationService {
  async create(
    userId: string,
    request: CreateConversationRequest,
  ) {
    const conversation = conversationRepository.create({
      userId,
      title: request.title?.trim() || "New Chat",
      providerId: request.providerId ?? null,
      modelId: request.modelId ?? null,
      isTemporary: request.isTemporary ?? false,
    });

    return conversationRepository.save(conversation);
  }

  async list(userId: string) {
    return conversationRepository.find({
      where: {
        userId,
      },
      order: {
        updatedAt: "DESC",
      },
    });
  }

  async getById(userId: string, conversationId: string) {
    return conversationRepository.findOne({
      where: {
        id: conversationId,
        userId,
      },
    });
  }

  async update(
    userId: string,
    conversationId: string,
    request: UpdateConversationRequest,
  ) {
    const conversation = await this.getById(
      userId,
      conversationId,
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (request.title !== undefined) {
      conversation.title = request.title.trim();
    }

    if (request.providerId !== undefined) {
      conversation.providerId = request.providerId;
    }

    if (request.modelId !== undefined) {
      conversation.modelId = request.modelId;
    }
    if (request.isTemporary !== undefined) {
      conversation.isTemporary =
        request.isTemporary;
    }
    return conversationRepository.save(conversation);
  }

  async delete(userId: string, conversationId: string) {
    const conversation = await this.getById(
      userId,
      conversationId,
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    await conversationRepository.remove(conversation);
  }

  async search(
    userId: string,
    query: string,
  ) {
    return conversationRepository
      .createQueryBuilder("conversation")
      .where(
        "conversation.userId = :userId",
        { userId },
      )
      .andWhere(
        "conversation.title ILIKE :query",
        {
          query: `%${query}%`,
        },
      )
      .orderBy(
        "conversation.updatedAt",
        "DESC",
      )
      .take(20)
      .getMany();
  }
}

export const conversationService =
  new ConversationService();