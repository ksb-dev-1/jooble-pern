import { Loader2Icon } from "lucide-react"
import { Navigate } from "react-router"

import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending && session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to={ROUTES.SIGN_IN} replace />
  }

  if (!session.user.emailVerified) {
    return <Navigate to={ROUTES.VERIFY_EMAIL} replace />
  }

  return <>{children}</>
}