import { Navigate } from "react-router"

import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = authClient.useSession()

  if (session?.user.emailVerified) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  if (session) {
    return <Navigate to={ROUTES.VERIFY_EMAIL} replace />
  }

  return children
}