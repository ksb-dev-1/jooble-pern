import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

import PasswordField from "@/components/auth/password-filed"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"
import { signInSchema } from "@/lib/validation"
import type { SignInValues } from "@/lib/validation"

export default function SignIn() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null)
  const navigate = useNavigate()

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Reset form on mount
  useEffect(() => {
    form.reset(form.formState.defaultValues)
  }, [form])

  // Handle form submit
  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    setErrorMessage(null)

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    })

    if (error) {
      setErrorMessage(error.message || "Something went wrong")
    } else {
      toast.success("Signed in successfully")
      navigate(ROUTES.DASHBOARD)
    }
  }

  // Handle social sign-in
  async function handleSocialSignIn(provider: "github" | "google") {
    setLoadingProvider(provider)
    setErrorMessage(null)

    const result = await authClient.signIn.social({
      provider,
      // callbackURL: ROUTES.DASHBOARD,
      callbackURL: `${window.location.origin}${ROUTES.DASHBOARD}`,
    })

    if (result?.error) {
      setErrorMessage(result.error.message ?? "Something went wrong")
    }

    setLoadingProvider(null)
  }

  const isLoading = form.formState.isSubmitting

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader>
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>
            Fill in the fields below to log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
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

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <PasswordField
                    field={field}
                    fieldState={fieldState}
                    showForgotPassword
                    label="Password"
                    placeholder="Enter your password"
                  />
                )}
              />
            </FieldGroup>

            {/* Remember me */}
            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2 mt-4">
                  <Checkbox
                    id={field.name}
                    checked={!!field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  <FieldLabel htmlFor={field.name} className="cursor-pointer">
                    Remember me
                  </FieldLabel>
                </div>
              )}
            />

            {/* Sign in button */}
            <Button type="submit" disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  Logging in
                  <LoaderCircle size={16} className="animate-spin" />
                </span>
              ) : (
                <span>Login</span>
              )}
            </Button>
          </form>

          <div className="grid grid-cols-2 gap-4 border-t pt-6 mt-6">
            {/* Sign in with google button */}
            <Button
              variant="outline"
              disabled={loadingProvider !== null}
              onClick={() => handleSocialSignIn("google")}
              className="w-full"
            >
              <FcGoogle /> Google{" "}
              {loadingProvider === "google" && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
            </Button>

            {/* Sign in with github button */}
            <Button
              variant="outline"
              disabled={loadingProvider !== null}
              onClick={() => handleSocialSignIn("github")}
              className="w-full"
            >
              <FaGithub /> Github
              {loadingProvider === "github" && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex w-full justify-center">
            <p className="text-muted-foreground text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={ROUTES.SIGN_UP} className="underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
