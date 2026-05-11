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
import { Category } from "./category.entity"

@Entity({ name: "budgets", schema: "finance" })
export class Budget {
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

	@ManyToOne(() => Category, { onDelete: "CASCADE" })
	@JoinColumn({ name: "categoryId" })
	category!: Category

	@Column()
	categoryId!: string

	@Column({ type: "decimal", precision: 12, scale: 2 })
	limit!: number

	// период бюджета — год и месяц
	@Column()
	year!: number

	@Column()
	month!: number

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
