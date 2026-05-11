import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-9xl font-black">404</h1>
        <h1 className="text-xl font-medium">Страница не найдена</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(-1)}
            className="w-min"
            variant="outline"
          >
            Назад
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="w-min"
            variant="outline"
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  )
}
