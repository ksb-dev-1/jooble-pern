import { BrowserRouter, Route, Routes } from "react-router"
import { Toaster } from "sonner"

import ProtectedRoute from "@/components/auth/protected-route"
import PublicRoute from "@/components/auth/public-route"
import MainLayout from "@/components/layout/main-layout"
import { ROUTES } from "@/constants/routes"
import ForgotPassword from "@/pages/auth/forgot-password"
import ResetPassword from "@/pages/auth/reset-password"
import SignIn from "@/pages/auth/sign-in"
import SignUp from "@/pages/auth/sign-up"
import VerifyEmail from "@/pages/auth/verify-email"
import Dashboard from "@/pages/dashboard"
import Home from "@/pages/home"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Layout routes */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Public routes */}
        <Route
          path={ROUTES.SIGN_IN}
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.SIGN_UP}
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  )
}
