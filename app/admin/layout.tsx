"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      return
    }

    // Check if user is authenticated admin
    const adminSessionString = localStorage.getItem("adminSession")
    if (!adminSessionString) {
      router.push("/admin/login")
      return
    }

    try {
      const adminSession = JSON.parse(adminSessionString)
      // If trying to access /admin/setup and not the Super Admin (ID "1")
      if (pathname === "/admin/setup" && adminSession.id !== "1") {
        router.push("/admin/dashboard?accessDenied=true") // Redirect to dashboard with an error
      }
    } catch (error) {
      console.error("Failed to parse admin session:", error)
      router.push("/admin/login") // Redirect to login if session is invalid
    }
  }, [router, pathname])

  return <>{children}</>
}
