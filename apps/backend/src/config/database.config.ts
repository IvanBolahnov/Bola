import { registerAs } from "@nestjs/config"
import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export default registerAs("database", (): TypeOrmModuleOptions => {
	return {
		type: "postgres",
		url: process.env.DATABASE_URL,
		entities: [__dirname + "/../**/*.entity{.ts,.js}"],
		migrations: [__dirname + "/../migrations/*{.ts,.js}"],
		synchronize: false, // никогда не используем в проде
		migrationsRun: true // автоматически запускает миграции при старте
	}
})
