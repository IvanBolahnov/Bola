import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { setupInterceptors } from "@/shared/api/interceptors"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

setupInterceptors()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
