import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	OneToMany
} from "typeorm"
import { uuidv7 } from "uuidv7"
import { UserRoleEnum } from "../enums/user-role.enum"
import { Session } from "../../auth/entities/session.entity"

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

	@OneToMany(() => Session, (session) => session.user)
	sessions!: Session[]

	@Column({ type: "enum", enum: UserRoleEnum, default: UserRoleEnum.USER })
	role!: UserRoleEnum

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
