import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity.js";
import { Provider } from "../providers/provider.entity.js";
import { AIModel } from "../providers/model.entity.js";
import { Message } from "../messages/message.entity.js";

@Entity("conversations")
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.conversations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  title!: string;

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

  @Column({ name: "is_temporary", default: false })
  isTemporary!: boolean;

  @OneToMany(() => Message, (message) => message.conversation)
  messages!: Message[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}