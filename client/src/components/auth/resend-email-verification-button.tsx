import { useState } from "react"

import { LoaderCircle } from "lucide-react"

import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"

import { Button } from "../ui/button"

export function ResendVerificationButton({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function resendVerificationEmail() {
    setSuccess(null)
    setError(null)
    setIsLoading(true)

    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: ROUTES.DASHBOARD,
    })

    setIsLoading(false)

    if (error) {
      setError(error.message || "Something went wrong")
    } else {
      setSuccess("Verification email sent successfully")
    }
  }

  return (
    <div className="space-y-4">
      {success && (
        <div role="status" className="text-sm text-green-600">
          {success}
        </div>
      )}
      {error && (
        <div role="alert" className="text-sm text-red-600">
          {error}
        </div>
      )}

      <Button onClick={resendVerificationEmail} disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            Sending
            <LoaderCircle size={16} className="animate-spin" />
          </span>
        ) : (
          <span>Resend verification email</span>
        )}
      </Button>
    </div>
  )
}
