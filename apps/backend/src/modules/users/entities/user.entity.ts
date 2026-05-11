import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert
} from "typeorm"
import { uuidv7 } from "uuidv7"

@Entity("users")
export class User {
	@PrimaryColumn("uuid")
	id!: string

	@BeforeInsert()
	generateId() {
		if (!this.id) {
			this.id = uuidv7()
		}
	}

	@Column({ unique: true })
	email!: string

	@Column({ select: false })
	password!: string

	@Column({ nullable: true })
	name!: string

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
