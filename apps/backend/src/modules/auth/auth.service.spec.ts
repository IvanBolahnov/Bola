import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { User } from "../users/entities/user.entity"
import { Session } from "./entities/session.entity"
import {
	ConflictException,
	UnauthorizedException,
	ForbiddenException
} from "@nestjs/common"
import * as bcrypt from "bcrypt"

const mockUser: User = {
	id: "019d5a22-fbf2-7c59-a351-a036ca958782",
	email: "test@test.com",
	password: "hashedpassword",
	name: "Test User",
	createdAt: new Date(),
	updatedAt: new Date(),
	generateId: jest.fn()
}

const createMockSession = (): Session => ({
	id: "019d5a22-fc48-7a20-a71d-a61cf093df6e",
	userId: mockUser.id,
	user: mockUser,
	refreshTokenHash: "hashedtoken",
	parentTokenHash: null!,
	isRevoked: false,
	revokedAt: null!,
	revokedReason: null!,
	userAgent: "Mozilla/5.0",
	ip: "127.0.0.1",
	deviceName: "Chrome on Windows",
	expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	createdAt: new Date(),
	lastUsedAt: new Date(),
	generateId: jest.fn()
})

describe("AuthService", () => {
	let service: AuthService

	const mockUsersRepo = {
		findOne: jest.fn(),
		create: jest.fn(),
		save: jest.fn()
	}

	const mockSessionsRepo = {
		findOne: jest.fn(),
		find: jest.fn(),
		create: jest.fn(),
		save: jest.fn()
	}

	const mockJwtService = {
		sign: jest.fn().mockReturnValue("mocked.jwt.token")
	}

	const mockConfigService = {
		get: jest.fn().mockReturnValue("test_secret")
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: getRepositoryToken(User), useValue: mockUsersRepo },
				{ provide: getRepositoryToken(Session), useValue: mockSessionsRepo },
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: ConfigService, useValue: mockConfigService }
			]
		}).compile()

		service = module.get<AuthService>(AuthService)

		// Сбрасываем моки перед каждым тестом
		jest.clearAllMocks()
	})

	// -----------------------------------------------------------------------
	describe("register", () => {
		it("должен зарегистрировать пользователя и вернуть токены", async () => {
			mockUsersRepo.findOne.mockResolvedValue(null)
			mockUsersRepo.create.mockReturnValue(mockUser)
			mockUsersRepo.save.mockResolvedValue(mockUser)
			mockSessionsRepo.create.mockReturnValue(createMockSession())
			mockSessionsRepo.save.mockResolvedValue(createMockSession())

			const result = await service.register(
				{ email: "test@test.com", password: "password123", name: "Test" },
				"Mozilla/5.0",
				"127.0.0.1"
			)

			expect(result).toHaveProperty("accessToken")
			expect(result).toHaveProperty("refreshToken")
			expect(result.user.email).toBe(mockUser.email)
		})

		it("должен выбросить ConflictException если email занят", async () => {
			mockUsersRepo.findOne.mockResolvedValue(mockUser)

			await expect(
				service.register(
					{ email: "test@test.com", password: "password123", name: "Test" },
					"Mozilla/5.0",
					"127.0.0.1"
				)
			).rejects.toThrow(ConflictException)
		})
	})

	// -----------------------------------------------------------------------
	describe("login", () => {
		it("должен вернуть токены при правильных credentials", async () => {
			const hashedPassword = await bcrypt.hash("password123", 12)
			mockUsersRepo.findOne.mockResolvedValue({
				...mockUser,
				password: hashedPassword
			})
			mockSessionsRepo.create.mockReturnValue(createMockSession())
			mockSessionsRepo.save.mockResolvedValue(createMockSession())

			const result = await service.login(
				{ email: "test@test.com", password: "password123" },
				"Mozilla/5.0",
				"127.0.0.1"
			)

			expect(result).toHaveProperty("accessToken")
			expect(result).toHaveProperty("refreshToken")
		})

		it("должен выбросить UnauthorizedException если пользователь не найден", async () => {
			mockUsersRepo.findOne.mockResolvedValue(null)

			await expect(
				service.login(
					{ email: "wrong@test.com", password: "password123" },
					"Mozilla/5.0",
					"127.0.0.1"
				)
			).rejects.toThrow(UnauthorizedException)
		})

		it("должен выбросить UnauthorizedException если пароль неверный", async () => {
			const hashedPassword = await bcrypt.hash("correctpassword", 12)
			mockUsersRepo.findOne.mockResolvedValue({
				...mockUser,
				password: hashedPassword
			})

			await expect(
				service.login(
					{ email: "test@test.com", password: "wrongpassword" },
					"Mozilla/5.0",
					"127.0.0.1"
				)
			).rejects.toThrow(UnauthorizedException)
		})
	})

	// -----------------------------------------------------------------------
	describe("refresh", () => {
		it("должен выбросить UnauthorizedException если токен не найден", async () => {
			mockSessionsRepo.findOne.mockResolvedValue(null)

			await expect(
				service.refresh("invalidtoken", "Mozilla/5.0", "127.0.0.1")
			).rejects.toThrow(UnauthorizedException)
		})

		it("должен выбросить ForbiddenException при reuse attack", async () => {
			// Первый вызов (по refreshTokenHash) — не найден
			// Второй вызов (по parentTokenHash) — найден = reuse attack
			mockSessionsRepo.findOne
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(createMockSession())
			mockSessionsRepo.find.mockResolvedValue([createMockSession()])
			mockSessionsRepo.save.mockResolvedValue(createMockSession())

			await expect(
				service.refresh("stolentoken", "Mozilla/5.0", "127.0.0.1")
			).rejects.toThrow(ForbiddenException)
		})

		it("должен выбросить UnauthorizedException если сессия отозвана", async () => {
			mockSessionsRepo.findOne.mockResolvedValue({
				...createMockSession(),
				isRevoked: true
			})

			await expect(
				service.refresh("sometoken", "Mozilla/5.0", "127.0.0.1")
			).rejects.toThrow(UnauthorizedException)
		})

		it("должен выбросить ForbiddenException если userAgent не совпадает", async () => {
			const crypto = await import("crypto")
			const token = "sometoken"
			const tokenHash = crypto.createHash("sha256").update(token).digest("hex")

			mockSessionsRepo.findOne.mockResolvedValue({
				...createMockSession(),
				refreshTokenHash: tokenHash // хэш совпадает с токеном
			})
			mockSessionsRepo.save.mockResolvedValue(createMockSession())

			await expect(
				service.refresh(token, "DifferentBrowser/1.0", "127.0.0.1")
			).rejects.toThrow(ForbiddenException)
		})
	})

	// -----------------------------------------------------------------------
	describe("logout", () => {
		it("должен отозвать сессию", async () => {
			mockSessionsRepo.findOne.mockResolvedValue(createMockSession())
			mockSessionsRepo.save.mockResolvedValue({
				...createMockSession(),
				isRevoked: true
			})

			await service.logout(createMockSession().id)

			expect(mockSessionsRepo.save).toHaveBeenCalledWith(
				expect.objectContaining({ isRevoked: true })
			)
		})

		it("не должен падать если сессия не найдена", async () => {
			mockSessionsRepo.findOne.mockResolvedValue(null)
			await expect(service.logout("nonexistent-id")).resolves.not.toThrow()
		})
	})
})
