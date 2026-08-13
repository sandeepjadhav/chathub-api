import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity.js";

export enum LibraryItemType {
  CONVERSATION = "conversation",
  MESSAGE = "message",
  CODE = "code",
  PROMPT = "prompt",
  DOCUMENT = "document",
}

@Entity("library_items")
export class LibraryItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.libraryItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({
    type: "enum",
    enum: LibraryItemType,
  })
  type!: LibraryItemType;

  @Column()
  title!: string;

@Column({ name: "content", type: "text", nullable: true })
  content!: string | null;

@Column({ name: "conversation_id", type: "uuid", nullable: true })
  conversationId!: string | null;

@Column({ name: "message_id", type: "uuid", nullable: true })
  messageId!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}