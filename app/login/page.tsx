"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck } from "lucide-react"
import { StatusAlert } from "@/components/ui/status-alert" // Import StatusAlert
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back" // Import PageHeaderWithBack
import { AuthCard } from "@/components/auth/auth-card" // Import AuthCard
import { initializeAppData, getCustomers, getDrivers, loginCustomer, loginDriver } from "@/lib/app-data"
import { verifyPassword } from "@/lib/security"

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
      if (role === "customer") {
        const customers = getCustomers()
        const customer = customers.find((c) => c.email === email)

        if (customer && (await verifyPassword(password, customer.passwordHash))) {
          loginCustomer({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            loginTime: new Date().toISOString(),
          })
          router.push("/customer/dashboard")
        } else {
          setMessage({ type: "error", text: "Invalid customer credentials." })
        }
      } else if (role === "driver") {
        const drivers = getDrivers()
        const driver = drivers.find((d) => d.email === email)

        if (driver && (await verifyPassword(password, driver.passwordHash))) {
          loginDriver({
            id: driver.id,
            email: driver.email,
            name: driver.name,
            vehicleType: driver.vehicleType,
            loginTime: new Date().toISOString(),
          })
          router.push("/driver/dashboard")
        } else {
          setMessage({ type: "error", text: "Invalid driver credentials." })
        }
      } else {
        setMessage({ type: "error", text: "Please select a role." })
      }
    } catch (err) {
      console.error("Login error:", err)
      setMessage({ type: "error", text: "An unexpected error occurred during login." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <PageHeaderWithBack title="Trolla" backLink="/" icon={Truck} />

        <AuthCard title="Welcome Back" description="Sign in to your account to continue">
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
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <StatusAlert message={message} />
            <div className="mt-4 text-center text-sm">
              {"Don't have an account? "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  )
}
