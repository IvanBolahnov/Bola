import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/entities/user/model/authStore"
import { AppLayout, AppLayoutSkeleton } from "@/widgets/layout/ui/AppLayout"
import NotFoundPage from "@/pages/notFound"
import FinancePage from "@/pages/finance"
import WalletPage from "@/pages/finance/wallet"
import CategoriesPage from "@/pages/finance/categories"
import AdminPage from "@/pages/admin"

const LoginPage = lazy(() => import("@/pages/login"))
const RegisterPage = lazy(() => import("@/pages/register"))
const ProfilePage = lazy(() => import("@/pages/profile"))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? (
    <AppLayout>{children}</AppLayout>
  ) : (
    <Navigate to="/login" replace />
  )
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== "admin") {
    return <Navigate to="/profile" replace />
  }
  return <AppLayout>{children}</AppLayout>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return !isAuthenticated ? (
    // <AppLayout>{children}</AppLayout>
    <>{children}</>
  ) : (
    <Navigate to="/" />
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<AppLayoutSkeleton />}>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={"profile"} replace />} />

        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/:id"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
