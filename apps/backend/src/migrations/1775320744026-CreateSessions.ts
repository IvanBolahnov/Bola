import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessions1775320744026 implements MigrationInterface {
    name = 'CreateSessions1775320744026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sessions_revokedreason_enum" AS ENUM('reuse_attack', 'logout', 'expired', 'manual')`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "refreshTokenHash" character varying NOT NULL, "parentTokenHash" character varying, "isRevoked" boolean NOT NULL DEFAULT false, "revokedAt" TIMESTAMP, "revokedReason" "public"."sessions_revokedreason_enum", "userAgent" character varying, "ip" character varying, "deviceName" character varying, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TYPE "public"."sessions_revokedreason_enum"`);
    }

}
