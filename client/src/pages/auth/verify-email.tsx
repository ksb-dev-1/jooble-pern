import { LoaderCircleIcon } from "lucide-react"
import { useNavigate } from "react-router"

import { ResendVerificationButton } from "@/components/auth/resend-email-verification-button"
import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"

export default function VerifyEmail() {
  const { data: session, isPending, error } = authClient.useSession()
  const user = session?.user
  const navigate = useNavigate()

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoaderCircleIcon size={32} className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="font-bolf text-xl">Failed to fetch user session</p>
        <p className="text-sm text-slate-600 dark:text-muted-foreground">
          Refresh page to try again
        </p>
      </div>
    )
  }

  if (!user?.email) {
    navigate(ROUTES.SIGN_IN)
    return
  }

  return (
    <div className="min-h-screen flex flex-1 items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Verify your email</h1>
          <p className="text-slate-600 dark:text-muted-foreground">
            A verification email was sent to your inbox.
          </p>
        </div>
        <ResendVerificationButton email={user.email} />
      </div>
    </div>
  )
}
