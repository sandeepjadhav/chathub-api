import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../config/env.js";
import { User } from "../modules/users/user.entity.js";
import { Provider } from "../modules/providers/provider.entity.js";
import { AIModel } from "../modules/providers/model.entity.js";
import { Conversation } from "../modules/conversations/conversation.entity.js";
import { Message } from "../modules/messages/message.entity.js";
import { LibraryItem } from "../modules/library/library-item.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: false,
  logging: true,
  entities: [User,
    Provider,
    AIModel,
    Conversation,
    Message,
    LibraryItem,],
  migrations: ["dist/database/migrations/*.js"],
});
