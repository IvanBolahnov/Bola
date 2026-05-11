import { Link } from "react-router-dom"
import { LoginForm } from "@/features/auth/ui/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-medium">Добро пожаловать</h1>
          <p className="text-sm text-muted-foreground">
            Войдите в свой аккаунт
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="text-foreground underline underline-offset-4"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
