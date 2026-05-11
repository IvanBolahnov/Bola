import { create } from "zustand"
import { persist } from "zustand/middleware"

interface LayoutState {
  isSidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  toggleSidebarOpen: () => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      setSidebarOpen: (value) => set({ isSidebarOpen: value }),
      toggleSidebarOpen: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: "layout-storage",
    }
  )
)
