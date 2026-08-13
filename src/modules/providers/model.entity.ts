import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Provider } from "./provider.entity.js";

@Entity("models")
export class AIModel {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "provider_id" })
  providerId!: string;

  @ManyToOne(() => Provider, (provider) => provider.models, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "provider_id" })
  provider!: Provider;

  @Column()
  name!: string;

  @Column({ name: "display_name" })
  displayName!: string;

  @Column({
    name: "context_window",
    type: "integer",
    nullable: true,
  })
  contextWindow!: number | null;

  @Column({ default: true })
  enabled!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}