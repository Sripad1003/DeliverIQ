"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusAlert } from "@/components/ui/status-alert" // Import StatusAlert
import { AuthCard } from "@/components/auth/auth-card" // Import AuthCard
import { initializeAppData, loginUser } from "@/lib/app-data"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" }) // Use message state for errors
  const router = useRouter()

  useEffect(() => {
    initializeAppData()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" }) // Clear previous messages

    try {
      const user = await loginUser(email, password, role)

      if (user) {
        if (user.role === "customer") {
          router.push("/customer/dashboard")
        } else if (user.role === "driver") {
          router.push("/driver/dashboard")
        }
      } else {
        setMessage({ type: "error", text: "Invalid credentials." })
      }
    } catch (err) {
      console.error("Login error:", err)
      setMessage({ type: "error", text: "An unexpected error occurred during login." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <AuthCard
        title="Login to DeliverIQ"
        description="Enter your credentials to access your account."
        footer={
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link className="underline" href="/signup">
              Sign up
            </Link>
          </div>
        }
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Login as</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </Button>
          <StatusAlert message={message} />
        </form>
      </AuthCard>
    </div>
  )
}
