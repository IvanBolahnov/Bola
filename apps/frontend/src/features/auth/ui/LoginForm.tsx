import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "../model/useLogin"
import { loginSchema, type LoginFormData } from "../model/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/shared/lib/utils"
import { PasswordInput } from "@/shared/ui/PasswordInput"
import { Spinner } from "@/components/ui/spinner"

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => login(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          autoComplete="current-password"
          {...register("password")}
          className={cn(errors.password && "border-destructive")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <p className="text-left text-xs text-destructive">
          {error?.message || "Ошибка входа. Попробуйте еще раз."}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner />
            Вход...
          </>
        ) : (
          "Войти"
        )}
      </Button>
    </form>
  )
}
