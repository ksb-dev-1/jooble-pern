import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, MoveLeft } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"
import { forgotPasswordSchema } from "@/lib/validation"
import type { ForgotPasswordValues } from "@/lib/validation"

export default function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Reset form on mount
  useEffect(() => {
    form.reset(form.formState.defaultValues)
  }, [form])

  // Handle form submit
  async function onSubmit({ email }: ForgotPasswordValues) {
    setSuccessMessage(null)
    setErrorMessage(null)

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: ROUTES.RESET_PASSWORD,
    })

    if (error) {
      setErrorMessage(error.message || "Something went wrong")
    } else {
      setSuccessMessage(
        "We've sent a password reset link to the email address you entered."
      )
      form.reset()
    }
  }

  const isLoading = form.formState.isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your registered email below and we’ll send you a password
            reset link
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
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="your@email.com"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Send password reset link button */}
            <Button type="submit" disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  Sending
                  <LoaderCircle size={16} className="animate-spin" />
                </span>
              ) : (
                <span>submit</span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link
            to={ROUTES.SIGN_IN}
            className="text-slate-600 dark:text-muted-foreground text-sm underline flex items-center gap-2"
          >
            <MoveLeft size={12} /> Bcak to Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
