import { z } from "zod"

export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
})

export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>
