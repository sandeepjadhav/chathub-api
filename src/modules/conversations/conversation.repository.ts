import { AppDataSource } from "../../database/data-source.js";
import { Conversation } from "./conversation.entity.js";

export const conversationRepository =
  AppDataSource.getRepository(Conversation);
  