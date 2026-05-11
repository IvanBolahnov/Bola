import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/shared/api/auth"
import { toast } from "sonner"
import type { Session } from "react-router-dom"

export function useRevokeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sessionId: string) => authApi.revokeSession(sessionId),
    onMutate: async (sessionId) => {
      // Отменяем текущие запросы чтобы не перезаписали оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: ["sessions"] })

      // Сохраняем текущее состояние для отката
      const previousSessions = queryClient.getQueryData<Session[]>(["sessions"])

      // Оптимистично убираем сессию из кэша
      queryClient.setQueryData<Session[]>(
        ["sessions"],
        (old) => old?.filter((s) => s.id !== sessionId) ?? []
      )

      return { previousSessions }
    },

    onSuccess: ({ data }) => {
      toast.success(`Сессия ${data.deviceName} удалена`)
    },

    onError: (_error, _sessionId, context) => {
      // Откатываем если ошибка
      if (context?.previousSessions) {
        queryClient.setQueryData(["sessions"], context.previousSessions)
      }
      toast.error("Не удалось удалить сессию")
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })
}
