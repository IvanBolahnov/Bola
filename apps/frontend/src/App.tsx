import { Providers } from "@/app/providers"
import { AppRouter } from "@/app/router"
import { ThemeProvider } from "@/components/theme-provider"

export function App() {
  return (
    <ThemeProvider>
      <Providers>
        <AppRouter />
      </Providers>
    </ThemeProvider>
  )
}

export default App
