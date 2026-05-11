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
import { WalletTypeEnum } from "../enums/wallet-type.enum"
import { CurrencyEnum } from "../enums/currency.enum"

@Entity({ name: "wallets", schema: "finance" })
export class Wallet {
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

	@Column({ type: "enum", enum: WalletTypeEnum })
	type!: WalletTypeEnum

	@Column({ type: "enum", enum: CurrencyEnum, default: CurrencyEnum.EUR })
	currency!: CurrencyEnum

	@Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
	balance!: number

	@Column({ nullable: true })
	description!: string

	@Column({ default: true })
	isActive!: boolean

	@CreateDateColumn()
	createdAt!: Date

	@UpdateDateColumn()
	updatedAt!: Date
}
