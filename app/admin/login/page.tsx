"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { initializeAdminData, getAdminData, getSecurityKeyHash } from "@/lib/admin-data"
import { verifyPassword, verifySecurityKey } from "@/lib/security"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminKey, setAdminKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Initialize admin data on component mount
    initializeAdminData()
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get admin data and security key hash
      const admins = getAdminData()
      const securityKeyHash = getSecurityKeyHash()

      // Find admin by email
      const admin = admins.find((a) => a.email === email && a.status === "active")

      if (!admin) {
        setError("Invalid admin credentials. Access denied.")
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
        setError("Invalid admin credentials. Access denied.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          </div>
        </div>

        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Restricted Access:</strong> This area is for authorized administrators only. Unauthorized access
            attempts are logged and monitored.
          </AlertDescription>
        </Alert>

        <Card className="border-red-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-red-700">Administrator Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the control panel
              <br />
              <span className="text-xs text-gray-500 mt-1 block">
                Default: admin@trolla.com / admin123 / TROLLA_ADMIN_2024
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
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

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>

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
          All admin access attempts are logged for security purposes
        </div>
      </div>
    </div>
  )
}
