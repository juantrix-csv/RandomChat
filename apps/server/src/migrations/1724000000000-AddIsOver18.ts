import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsOver181724000000000 implements MigrationInterface {
  name = 'AddIsOver181724000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profiles" ADD "is_over_18" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "is_over_18"`);
  }
}
