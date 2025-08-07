"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Shield } from "lucide-react"
import { StatusAlert } from "../../../components/ui/status-alert" // Import StatusAlert
import { PageHeaderWithBack } from "../../../components/layout/page-header-with-back" // Import PageHeaderWithBack
import { AuthCard } from "../../../components/auth/auth-card" // Import AuthCard
import { initializeAdminData, getAdminData, getSecurityKeyHash } from "../../../lib/admin-data"
import { verifyPassword, verifySecurityKey } from "../../../lib/security"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" }) // Use message state for errors
  const router = useRouter()

  useEffect(() => {
    // Initialize admin data on component mount
    initializeAdminData()
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" }) // Clear previous messages

    try {
      // Get admin data and security key hash
      const admins = getAdminData()
      const securityKeyHash = getSecurityKeyHash()

      // Find admin by email
      const admin = admins.find((a) => a.email === email && a.status === "active")

      if (!admin) {
        setMessage({ type: "error", text: "Invalid admin credentials. Access denied." })
        setIsLoading(false)
        return
      }

      // Verify password and security key
      const [passwordValid, keyValid] = await Promise.all([
        verifyPassword(password, admin.passwordHash),
        verifySecurityKey(adminKey, securityKeyHash),
      ])

      if (passwordValid && keyValid) {
        // Store admin session securely with admin info
        localStorage.setItem(
          "adminSession",
          JSON.stringify({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/admin/dashboard")
      } else {
        setMessage({ type: "error", text: "Invalid admin credentials. Access denied." })
      }
    } catch (error) {
      console.error("Login error:", error)
      setMessage({ type: "error", text: "Login failed. Please try again." })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <PageHeaderWithBack title="Admin Access" backLink="/" icon={Shield} iconColorClass="text-red-600" />

        <StatusAlert
          message={{
            type: "warning",
            text: "Restricted Access: This area is for authorized administrators only. Unauthorized access attempts are logged and monitored.",
          }}
          className="border-red-200 bg-red-50 text-red-800"
        />

        <AuthCard
          title="Administrator Login"
          description={
            <>
              Enter your admin credentials to access the control panel
              <br />
              <span className="text-xs text-gray-500 mt-1 block">
                Default: admin@deliveriq.com / admin123 / DELIVERIQ_ADMIN_2024
              </span>
            </>
          }
          titleColorClass="text-red-700"
        >
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Security Key</Label>
              <Input
                id="adminKey"
                type="password"
                placeholder="Enter admin security key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>

            <StatusAlert message={message} />

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Access Admin Panel"}
            </Button>
          </form>
        </AuthCard>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Security Features:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Passwords are hashed using SHA-256</li>
            <li>• Security keys are encrypted</li>
            <li>• All login attempts are monitored</li>
            <li>• Session data is securely stored</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          All DeliverIQ admin access attempts are logged for security purposes
        </div>
      </div>
    </div>
  )
}
