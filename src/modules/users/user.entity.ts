import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Conversation } from "../conversations/conversation.entity";
import { LibraryItem } from "../library/library-item.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ name: "password_hash" })
  passwordHash!: string;

  @Column({ name: "avatar_url", type: "varchar", nullable: true })
  avatarUrl!: string | null;

  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations!: Conversation[];

  @OneToMany(() => LibraryItem, (libraryItem) => libraryItem.user)
  libraryItems!: LibraryItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}