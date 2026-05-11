import { MigrationInterface, QueryRunner } from "typeorm"

export class AddIsAccepded1778321868195 implements MigrationInterface {
	name = "AddIsAccepded1778321868195"

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "sessions" ADD "isAccepted" boolean NOT NULL DEFAULT false`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "isAccepted"`)
	}
}
