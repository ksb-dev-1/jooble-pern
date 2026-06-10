import z from "zod"

// Email schema
export const emailSchema = z.email({ message: "Please enter a valid email" })

// Password schema
export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  })

// Confirm password schema
export const confirmPasswordSchema = z
  .string()
  .min(1, { message: "Please confirm password" })

// ========================================
// Sign up form validation
// ========================================
export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  })

export type SignUpValues = z.infer<typeof signUpSchema>

// ========================================
// Sign in form validation
// ========================================
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
})

export type SignInValues = z.infer<typeof signInSchema>

// ========================================
// Forgot password form validation
// ========================================
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

// ========================================
// Reset password form validation
// ========================================
export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  passwordConfirmation: confirmPasswordSchema,
})

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
