import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { ThrottlerModule } from "@nestjs/throttler"
import databaseConfig from "./config/database.config"
import { AuthModule } from "./modules/auth/auth.module"
import { FinanceModule } from "./modules/finance/finance.module"
import { UsersModule } from "./modules/users/users.module"
import { APP_GUARD } from "@nestjs/core"
import { CustomThrottlerGuard } from "./guards/custom-throttler.guard"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig]
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) =>
				config.get<TypeOrmModuleOptions>("database")!
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60_000, // 1 минута
				limit: 60 // 60 запросов
			}
		]),

		AuthModule,
		UsersModule,
		FinanceModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: CustomThrottlerGuard
		}
	]
})
export class AppModule {}
