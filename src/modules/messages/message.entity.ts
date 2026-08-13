import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversation } from "../conversations/conversation.entity.js";
import { Provider } from "../providers/provider.entity.js";
import { AIModel } from "../providers/model.entity.js";

export enum MessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant",
}

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "conversation_id" })
  conversationId!: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "conversation_id" })
  conversation!: Conversation;

  @Column({
    type: "enum",
    enum: MessageRole,
  })
  role!: MessageRole;

  @Column({ type: "text" })
  content!: string;

  @Column({ name: "provider_id", type: "uuid", nullable: true })
  providerId!: string | null;

  @ManyToOne(() => Provider, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "provider_id" })
  provider!: Provider | null;

  @Column({ name: "model_id", type: "uuid", nullable: true })
  modelId!: string | null;

  @ManyToOne(() => AIModel, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "model_id" })
  model!: AIModel | null;

  @Column()
  sequence!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}