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
import { RecurringIntervalEnum } from "../enums/recurring-interval.enum"

@Entity({ name: "recurring_transactions", schema: "finance" })
export class RecurringTransaction {
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

	@ManyToOne(() => Category, { onDelete: "SET NULL", nullable: true })
	@JoinColumn({ name: "categoryId" })
	category!: Category

	@Column({ nullable: true })
	categoryId!: string

	@Column({ type: "enum", enum: RecurringIntervalEnum })
	interval!: RecurringIntervalEnum

	@Column({ type: "timestamp" })
	startDate!: Date

	@Column({ type: "timestamp", nullable: true })
	nextDate!: Date

	@Column({ type: "timestamp", nullable: true })
	endDate!: Date

	@Column({ default: true })
	isActive!: boolean

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
