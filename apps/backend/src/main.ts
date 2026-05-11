import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { AppModule } from "./app.module"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	// Безопасность
	app.use(helmet())

	// Cookies
	app.use(cookieParser())

	// CORS
	app.enableCors({
		// origin: [config.get<string>("CORS_ORIGIN"), "http://localhost:5173"],
		origin: true,
		credentials: true, // важно для httpOnly cookies
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"ngrok-skip-browser-warning"
		]
	})

	// Глобальная валидация DTO
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // срезает поля которых нет в DTO
			forbidNonWhitelisted: true, // кидает ошибку если пришло лишнее поле
			transform: true // автоматически трансформирует типы
		})
	)

	// Префикс для всех роутов
	app.setGlobalPrefix("api")

	const port = config.get<number>("PORT") ?? 3000
	await app.listen(port)
}

void bootstrap()
