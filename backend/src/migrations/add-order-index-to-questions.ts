import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderIndexToQuestions implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the new column 'order_index' to the 'questions' table
    await queryRunner.query(`
            ALTER TABLE questions
            ADD COLUMN order_index integer NOT NULL DEFAULT 0
        `);

    // Optionally: populate order_index for existing rows
    await queryRunner.query(`
            UPDATE questions
            SET order_index = id::int -- Or use a different logic to set the initial value
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: remove the 'order_index' column
    await queryRunner.query(`
            ALTER TABLE questions
            DROP COLUMN order_index
        `);
  }
}
