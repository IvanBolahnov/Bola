import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Минимум 2 символа")
      .max(50, "Максимум 50 символов"),
    email: z.email("Некорректный email"),
    password: z
      .string()
      .min(8, "Минимум 8 символов")
      .max(32, "Максимум 32 символа"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
