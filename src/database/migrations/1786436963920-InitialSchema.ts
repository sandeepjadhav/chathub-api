import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1786436963920 implements MigrationInterface {
  name = "InitialSchema1786436963920";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" varchar NOT NULL,
        "name" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "avatar_url" varchar,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "providers" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "display_name" varchar NOT NULL,
        "type" varchar NOT NULL,
        "enabled" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_providers_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_providers_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "models" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "provider_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "display_name" varchar NOT NULL,
        "context_window" integer,
        "enabled" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_models_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "message_role_enum"
      AS ENUM ('system', 'user', 'assistant')
    `);

    await queryRunner.query(`
      CREATE TABLE "conversations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "title" varchar NOT NULL,
        "provider_id" uuid,
        "model_id" uuid,
        "is_temporary" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_conversations_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "conversation_id" uuid NOT NULL,
        "role" "message_role_enum" NOT NULL,
        "content" text NOT NULL,
        "provider_id" uuid,
        "model_id" uuid,
        "sequence" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "library_item_type_enum"
      AS ENUM (
        'conversation',
        'message',
        'code',
        'prompt',
        'document'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "library_items" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "type" "library_item_type_enum" NOT NULL,
        "title" varchar NOT NULL,
        "content" text,
        "conversation_id" uuid,
        "message_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_library_items_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "models"
      ADD CONSTRAINT "FK_models_provider"
      FOREIGN KEY ("provider_id")
      REFERENCES "providers"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "conversations"
      ADD CONSTRAINT "FK_conversations_user"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "conversations"
      ADD CONSTRAINT "FK_conversations_provider"
      FOREIGN KEY ("provider_id")
      REFERENCES "providers"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "conversations"
      ADD CONSTRAINT "FK_conversations_model"
      FOREIGN KEY ("model_id")
      REFERENCES "models"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "messages"
      ADD CONSTRAINT "FK_messages_conversation"
      FOREIGN KEY ("conversation_id")
      REFERENCES "conversations"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "messages"
      ADD CONSTRAINT "FK_messages_provider"
      FOREIGN KEY ("provider_id")
      REFERENCES "providers"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "messages"
      ADD CONSTRAINT "FK_messages_model"
      FOREIGN KEY ("model_id")
      REFERENCES "models"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "library_items"
      ADD CONSTRAINT "FK_library_items_user"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
  CREATE INDEX "IDX_conversations_user_updated"
  ON "conversations" ("user_id", "updated_at")
`);

    await queryRunner.query(`
  CREATE INDEX "IDX_messages_conversation_sequence"
  ON "messages" ("conversation_id", "sequence")
`);

    await queryRunner.query(`
  CREATE INDEX "IDX_library_items_user_created"
  ON "library_items" ("user_id", "created_at")
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_library_items_user_created"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_messages_conversation_sequence"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_conversations_user_updated"
    `);

    await queryRunner.query(`
      ALTER TABLE "library_items"
      DROP CONSTRAINT "FK_library_items_user"
    `);

    await queryRunner.query(`
      ALTER TABLE "messages"
      DROP CONSTRAINT "FK_messages_model"
    `);

    await queryRunner.query(`
      ALTER TABLE "messages"
      DROP CONSTRAINT "FK_messages_provider"
    `);

    await queryRunner.query(`
      ALTER TABLE "messages"
      DROP CONSTRAINT "FK_messages_conversation"
    `);

    await queryRunner.query(`
      ALTER TABLE "conversations"
      DROP CONSTRAINT "FK_conversations_model"
    `);

    await queryRunner.query(`
      ALTER TABLE "conversations"
      DROP CONSTRAINT "FK_conversations_provider"
    `);

    await queryRunner.query(`
      ALTER TABLE "conversations"
      DROP CONSTRAINT "FK_conversations_user"
    `);

    await queryRunner.query(`
      ALTER TABLE "models"
      DROP CONSTRAINT "FK_models_provider"
    `);

    await queryRunner.query(`DROP TABLE "library_items"`);
    await queryRunner.query(`DROP TYPE "library_item_type_enum"`);

    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TYPE "message_role_enum"`);

    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "models"`);
    await queryRunner.query(`DROP TABLE "providers"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}