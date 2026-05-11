import { Link } from "react-router-dom"
import { RegisterForm } from "@/features/auth/ui/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-medium">Создать аккаунт</h1>
          <p className="text-sm text-muted-foreground">
            Заполните форму для регистрации
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link
            to="/login"
            className="text-foreground underline underline-offset-4"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
