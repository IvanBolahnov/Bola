import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	BeforeInsert
} from "typeorm"
import { uuidv7 } from "uuidv7"
import { User } from "../../users/entities/user.entity"
import { Wallet } from "./wallet.entity"
import { Category } from "./category.entity"
import { TransactionTypeEnum } from "../enums/transaction-type.enum"

@Entity({ name: "transactions", schema: "finance" })
export class Transaction {
	@PrimaryColumn("uuid")
	id!: string

	@BeforeInsert()
	generateId() {
		if (!this.id) this.id = uuidv7()
	}

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user!: User

	@Column()
	userId!: string

	@Column()
	title!: string

	@Column({ type: "enum", enum: TransactionTypeEnum })
	type!: TransactionTypeEnum

	@Column({ type: "decimal", precision: 12, scale: 2 })
	amount!: number

	@ManyToOne(() => Wallet, { onDelete: "SET NULL", nullable: true })
	@JoinColumn({ name: "walletId" })
	wallet!: Wallet

	@Column({ nullable: true })
	walletId!: string

	// для transfer — счёт назначения
	@ManyToOne(() => Wallet, { onDelete: "SET NULL", nullable: true })
	@JoinColumn({ name: "toWalletId" })
	toWallet!: Wallet

	@Column({ nullable: true })
	toWalletId!: string

	@ManyToOne(() => Category, { onDelete: "SET NULL", nullable: true })
	@JoinColumn({ name: "categoryId" })
	category!: Category

	@Column({ nullable: true })
	categoryId!: string

	@Column({ nullable: true })
	note!: string

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	date!: Date

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
