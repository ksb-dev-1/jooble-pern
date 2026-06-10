import { Loader2Icon } from "lucide-react"
import { Navigate } from "react-router"

import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2Icon size={32} className="animate-spin" />
      </div>
    )
  }

  if (session?.user.emailVerified)
    return <Navigate to={ROUTES.DASHBOARD} replace />

  if (session) return <Navigate to={ROUTES.VERIFY_EMAIL} replace />

  return children
}
