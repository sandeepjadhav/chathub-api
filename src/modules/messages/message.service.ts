import { messageRepository } from "./message.repository.js";

export class MessageService {
  async listByConversation(
    conversationId: string,
  ) {
    return messageRepository.find({
      where: {
        conversationId,
      },
      order: {
        sequence: "ASC",
      },
    });
  }

  async getNextSequence(
    conversationId: string,
  ): Promise<number> {
    const lastMessage = await messageRepository.findOne({
      where: {
        conversationId,
      },
      order: {
        sequence: "DESC",
      },
    });

    return (lastMessage?.sequence ?? 0) + 1;
  }
}

export const messageService = new MessageService();
