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
import { RevokedReasonEnum } from "../enums/revokedReason.enum"

@Entity("sessions")
export class Session {
	@PrimaryColumn("uuid")
	id!: string

	@BeforeInsert()
	generateId() {
		if (!this.id) {
			this.id = uuidv7()
		}
	}

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user!: User

	@Column()
	userId!: string

	@Column()
	refreshTokenHash!: string

	// Цепочка токенов
	@Column({ nullable: true })
	parentTokenHash!: string // хэш предыдущего токена

	@Column({ default: false })
	isRevoked!: boolean // токен был отозван (reuse attack или логаут)

	/* Показывает дошел ли токен до клиента */
	@Column({ default: false })
	isAccepted!: boolean

	@Column({ nullable: true })
	revokedAt!: Date

	@Column({ type: "enum", enum: RevokedReasonEnum, nullable: true })
	revokedReason!: RevokedReasonEnum | null // 'reuse_attack' | 'logout' | 'expired' | 'manual' | NULL

	@Column({ nullable: true })
	userAgent!: string

	@Column({ nullable: true })
	ip!: string

	@Column({ nullable: true })
	deviceName!: string

	@Column()
	expiresAt!: Date

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	lastUsedAt!: Date
}
