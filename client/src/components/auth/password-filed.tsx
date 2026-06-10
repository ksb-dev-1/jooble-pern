import { useState } from "react"

import { Eye, EyeOff } from "lucide-react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form"
import { Link } from "react-router"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants/routes"

type PasswordFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>
  fieldState: ControllerFieldState
  placeholder: string
  label?: string
  showForgotPassword?: boolean
}

export default function PasswordField<T extends FieldValues>({
  field,
  fieldState,
  placeholder,
  label,
  showForgotPassword = false,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e)
    if (!e.target.value) {
      setShowPassword(false)
    }
  }

  return (
    <Field data-invalid={fieldState.invalid}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

        {showForgotPassword && (
          <Link to={ROUTES.FORGOT_PASSWORD} className="hover:underline text-sm">
            Forgot your password?
          </Link>
        )}
      </div>

      <div className="relative">
        <Input
          {...field}
          id={field.name}
          type={showPassword ? "text" : "password"}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete="off"
          onChange={handleChange}
          className="pr-10"
        />

        {field.value && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
