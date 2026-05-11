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
import { TransactionTypeEnum } from "../enums/transaction-type.enum"

@Entity({ name: "categories", schema: "finance" })
export class Category {
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
	name!: string

	@Column({ nullable: true })
	icon!: string

	@Column({ nullable: true })
	color!: string

	// категория может быть только для расходов или только для доходов
	@Column({ type: "enum", enum: TransactionTypeEnum })
	type!: TransactionTypeEnum

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
