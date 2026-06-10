import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router"

import PasswordField from "@/components/auth/password-filed"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"
import { resetPasswordSchema } from "@/lib/validation"
import type { ResetPasswordValues } from "@/lib/validation"

export default function ResetPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") ?? undefined
  const navigate = useNavigate()

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      passwordConfirmation: "",
    },
  })

  // Reset form on mount
  useEffect(() => {
    form.reset(form.formState.defaultValues)
  }, [form])

  // Handle form submit
  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setSuccessMessage(null)
    setErrorMessage(null)

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    })

    if (error) {
      setErrorMessage(error.message || "Something went wrong")
    } else {
      setSuccessMessage("Password has been reset. You can now sign in.")
      setTimeout(() => navigate(ROUTES.SIGN_IN), 3000)
      form.reset()
    }
  }

  const isLoading = form.formState.isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Reset Password</CardTitle>
          <CardDescription>
            Set a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-4 flex items-center flex-wrap">
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert
              variant="destructive"
              className="mb-4 flex items-center flex-wrap"
            >
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Password */}
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    fieldState={fieldState}
                    label="Password"
                    placeholder="Create a password"
                  />
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="passwordConfirmation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    fieldState={fieldState}
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                  />
                )}
              />
            </FieldGroup>

            {/* Send password reset link button */}
            <Button type="submit" disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  Resetting
                  <LoaderCircle size={16} className="animate-spin" />
                </span>
              ) : (
                <span>Reset password</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
