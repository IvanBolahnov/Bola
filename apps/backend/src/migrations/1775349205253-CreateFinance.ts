import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateFinance1775349205253 implements MigrationInterface {
	name = "CreateFinance1775349205253"

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS finance`)
		await queryRunner.query(
			`CREATE TYPE "finance"."wallets_type_enum" AS ENUM('cash', 'card', 'savings', 'investment')`
		)
		await queryRunner.query(
			`CREATE TYPE "finance"."wallets_currency_enum" AS ENUM('EUR', 'USD', 'RUB', 'GBP')`
		)
		await queryRunner.query(
			`CREATE TABLE "finance"."wallets" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "name" character varying NOT NULL, "type" "finance"."wallets_type_enum" NOT NULL, "currency" "finance"."wallets_currency_enum" NOT NULL DEFAULT 'EUR', "balance" numeric(12,2) NOT NULL DEFAULT '0', "description" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TYPE "finance"."categories_type_enum" AS ENUM('income', 'expense', 'transfer')`
		)
		await queryRunner.query(
			`CREATE TABLE "finance"."categories" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "name" character varying NOT NULL, "icon" character varying, "color" character varying, "type" "finance"."categories_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TYPE "finance"."transactions_type_enum" AS ENUM('income', 'expense', 'transfer')`
		)
		await queryRunner.query(
			`CREATE TABLE "finance"."transactions" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "title" character varying NOT NULL, "type" "finance"."transactions_type_enum" NOT NULL, "amount" numeric(12,2) NOT NULL, "walletId" uuid, "toWalletId" uuid, "categoryId" uuid, "note" character varying, "date" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TYPE "finance"."recurring_transactions_type_enum" AS ENUM('income', 'expense', 'transfer')`
		)
		await queryRunner.query(
			`CREATE TYPE "finance"."recurring_transactions_interval_enum" AS ENUM('daily', 'weekly', 'monthly', 'yearly')`
		)
		await queryRunner.query(
			`CREATE TABLE "finance"."recurring_transactions" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "title" character varying NOT NULL, "type" "finance"."recurring_transactions_type_enum" NOT NULL, "amount" numeric(12,2) NOT NULL, "walletId" uuid, "categoryId" uuid, "interval" "finance"."recurring_transactions_interval_enum" NOT NULL, "startDate" TIMESTAMP NOT NULL, "nextDate" TIMESTAMP, "endDate" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6485db3243762a54992dc0ce3b7" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "finance"."budgets" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "categoryId" uuid NOT NULL, "limit" numeric(12,2) NOT NULL, "year" integer NOT NULL, "month" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c8a51748f82387644b773da482" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."wallets" ADD CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."categories" ADD CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_a88f466d39796d3081cf96e1b66" FOREIGN KEY ("walletId") REFERENCES "finance"."wallets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_8ae6618f9e901745e70f8828ec8" FOREIGN KEY ("toWalletId") REFERENCES "finance"."wallets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" ADD CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64" FOREIGN KEY ("categoryId") REFERENCES "finance"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."recurring_transactions" ADD CONSTRAINT "FK_ab59c63725771bd11c6e1d719a2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."recurring_transactions" ADD CONSTRAINT "FK_c3d8d4bb216ba8992656fb3b3b3" FOREIGN KEY ("walletId") REFERENCES "finance"."wallets"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."recurring_transactions" ADD CONSTRAINT "FK_d7578f10f8eeaec6241f19dd6e4" FOREIGN KEY ("categoryId") REFERENCES "finance"."categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."budgets" ADD CONSTRAINT "FK_27e688ddf1ff3893b43065899f9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."budgets" ADD CONSTRAINT "FK_3ece6e1292b7a86ba82145775a7" FOREIGN KEY ("categoryId") REFERENCES "finance"."categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "finance"."budgets" DROP CONSTRAINT "FK_3ece6e1292b7a86ba82145775a7"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."budgets" DROP CONSTRAINT "FK_27e688ddf1ff3893b43065899f9"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."recurring_transactions" DROP CONSTRAINT "FK_d7578f10f8eeaec6241f19dd6e4"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."recurring_transactions" DROP CONSTRAINT "FK_c3d8d4bb216ba8992656fb3b3b3"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."recurring_transactions" DROP CONSTRAINT "FK_ab59c63725771bd11c6e1d719a2"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_8ae6618f9e901745e70f8828ec8"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_a88f466d39796d3081cf96e1b66"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."categories" DROP CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741"`
		)
		await queryRunner.query(
			`ALTER TABLE "finance"."wallets" DROP CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97"`
		)
		await queryRunner.query(`DROP TABLE "finance"."budgets"`)
		await queryRunner.query(`DROP TABLE "finance"."recurring_transactions"`)
		await queryRunner.query(
			`DROP TYPE "finance"."recurring_transactions_interval_enum"`
		)
		await queryRunner.query(
			`DROP TYPE "finance"."recurring_transactions_type_enum"`
		)
		await queryRunner.query(`DROP TABLE "finance"."transactions"`)
		await queryRunner.query(`DROP TYPE "finance"."transactions_type_enum"`)
		await queryRunner.query(`DROP TABLE "finance"."categories"`)
		await queryRunner.query(`DROP TYPE "finance"."categories_type_enum"`)
		await queryRunner.query(`DROP TABLE "finance"."wallets"`)
		await queryRunner.query(`DROP TYPE "finance"."wallets_currency_enum"`)
		await queryRunner.query(`DROP TYPE "finance"."wallets_type_enum"`)
		await queryRunner.query(`DROP SCHEMA IF EXISTS finance CASCADE`)
	}
}
