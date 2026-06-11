import { useState } from "react"

import { LogOut, User } from "lucide-react"
// import { useNavigate } from "react-router"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { ROUTES } from "@/constants/routes"
import { authClient } from "@/lib/auth-client"

interface ProfileDropdownProps {
  image: string | null | undefined
}

const AVATAR_SIZE = 36

export default function ProfileDropdownMenu({ image }: ProfileDropdownProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  // const navigate = useNavigate()

  const handleSignOut = async () => {
    setOpen(false)
    setIsSigningOut(true)

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // navigate(ROUTES.SIGN_IN)
            toast.success("Signed out successfully")
          },
          onError: (error) => {
            toast.error("Failed to sign out")
            console.error("Sign out error:", error)
          },
        },
      })
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out. Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="ml-2 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Open user menu"
      >
        <Avatar>
          {image ? (
            <img
              src={image}
              alt="Profile picture"
              height={AVATAR_SIZE}
              width={AVATAR_SIZE}
              className="rounded-full border object-cover"
            />
          ) : (
            <AvatarFallback>
              <User size={16} aria-hidden="true" />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isSigningOut}
          onClick={handleSignOut}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
