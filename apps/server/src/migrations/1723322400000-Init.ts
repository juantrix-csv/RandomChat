import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1723322400000 implements MigrationInterface {
  name = 'Init1723322400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS citext`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" CITEXT UNIQUE NOT NULL,
        "password_hash" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "user_id" uuid PRIMARY KEY,
        "nickname" CITEXT UNIQUE NOT NULL,
        "bio" text,
        "age" integer,
        "country" text,
        "language" text,
        "interests" text[],
        "avatar_url" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "matches" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_a" uuid NOT NULL,
        "user_b" uuid NOT NULL,
        "language" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "closed_at" TIMESTAMPTZ,
        CONSTRAINT "FK_matches_user_a" FOREIGN KEY ("user_a") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_matches_user_b" FOREIGN KEY ("user_b") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "match_id" uuid NOT NULL,
        "sender_id" uuid NOT NULL,
        "type" text NOT NULL CHECK ("type" IN ('text','image','audio')),
        "content" text,
        "media_url" text,
        "media_meta" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "seen_at" TIMESTAMPTZ,
        CONSTRAINT "FK_messages_match" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_messages_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ad_impressions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "placement" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_ad_impressions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "idx_messages_match_created_at" ON "messages" ("match_id", "created_at")`);
    await queryRunner.query(`CREATE INDEX "idx_matches_language_created_at" ON "matches" ("language", "created_at")`);
    await queryRunner.query(`CREATE INDEX "idx_profiles_interests" ON "profiles" USING GIN ("interests")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_profiles_interests"`);
    await queryRunner.query(`DROP INDEX "idx_matches_language_created_at"`);
    await queryRunner.query(`DROP INDEX "idx_messages_match_created_at"`);
    await queryRunner.query(`DROP TABLE "ad_impressions"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "matches"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
