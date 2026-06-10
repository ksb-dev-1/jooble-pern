import { createAuthClient } from "better-auth/react"

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error("FRONTEND_URL is not defined")
}

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  fetchOptions: {
    credentials: "include",
  },
})
