import { AppDataSource } from "../../database/data-source.js";
import { Message } from "./message.entity.js";

export const messageRepository =
  AppDataSource.getRepository(Message);
  