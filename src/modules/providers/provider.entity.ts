import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AIModel } from "./model.entity";

@Entity("providers")
export class Provider {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ name: "display_name" })
  displayName!: string;

  @Column()
  type!: string;

  @Column({ default: true })
  enabled!: boolean;

  @OneToMany(() => AIModel, (model) => model.provider)
  models!: AIModel[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}