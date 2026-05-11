import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister } from "../model/useRegister"
import { registerSchema, type RegisterFormData } from "../model/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/shared/lib/utils"
import { PasswordInput } from "@/shared/ui/PasswordInput"
import { Spinner } from "@/components/ui/spinner"

export function RegisterForm() {
  const { mutate: register_, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword: _, ...payload } = data
    register_(payload)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          placeholder="Иван"
          autoComplete="name"
          {...register("name")}
          className={cn(errors.name && "border-destructive")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className={cn(errors.email && "border-destructive")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Пароль</Label>
        <PasswordInput
          id="password"
          placeholder="••••••••••••••••"
          autoComplete="new-password"
          {...register("password")}
          className={cn(errors.password && "border-destructive")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Повторите пароль</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className={cn(errors.confirmPassword && "border-destructive")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <p className="text-center text-xs text-destructive">
          Ошибка регистрации. Попробуйте снова.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Регистрация...
          </>
        ) : (
          "Зарегистрироваться"
        )}
      </Button>
    </form>
  )
}
