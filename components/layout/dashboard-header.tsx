'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { adminLogout } from "@/actions/admin-actions"
import { customerLogout, driverLogout } from "@/actions/user-actions"
import { toast } from "sonner"

interface DashboardHeaderProps {
  title: string
  userEmail: string
}

export function DashboardHeader({ title, userEmail }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    // Determine user type based on current path
    if (window.location.pathname.startsWith("/admin")) {
      await adminLogout()
      toast.info("Logged out from admin dashboard.")
      router.push("/admin/login")
    } else if (window.location.pathname.startsWith("/customer")) {
      await customerLogout()
      toast.info("Logged out from customer dashboard.")
      router.push("/login")
    } else if (window.location.pathname.startsWith("/driver")) {
      await driverLogout()
      toast.info("Logged out from driver dashboard.")
      router.push("/login")
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 dark:text-gray-300 text-sm hidden md:block">{userEmail}</span>
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    </header>
  )
}
