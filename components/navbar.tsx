"use client";

import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, signInWithGoogle, logout, isAllowedDomain } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 md:px-6">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-lg font-semibold"
        >
          Campus Votes
        </motion.div>

        {/* Right Section */}
        {!user ? (
          // 🔹 Logged out → Google button
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button onClick={signInWithGoogle}>Continue with Google</Button>
          </motion.div>
        ) : !isAllowedDomain ? (
          // 🔹 Logged in with non-allowed email
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-600 font-medium">
              Invalid Account
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={logout}
              className="rounded-lg"
            >
              Logout
            </Button>
          </div>
        ) : (
          // 🔹 Logged in & allowed → profile dropdown
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none ring-0">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    alt={user.name}
                    src={
                      user.image ||
                      "/placeholder.svg?height=64&width=64&query=avatar"
                    }
                  />
                  <AvatarFallback>
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl shadow-lg"
            >
              <DropdownMenuLabel className="text-sm font-semibold">
                {user.name}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Profile coming soon!")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
