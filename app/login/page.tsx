'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatusAlert } from "@/components/ui/status-alert"
import { customerLogin, driverLogin } from "@/actions/user-actions"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"customer" | "driver">("customer")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let result
      if (userType === "customer") {
        result = await customerLogin(email, password)
      } else {
        result = await driverLogin(email, password)
      }

      if (result.success) {
        toast.success(`${userType === "customer" ? "Customer" : "Driver"} login successful!`)
        router.push(`/${userType}/dashboard`)
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      toast.error("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <AuthCard
        title="Login"
        description="Access your DeliverIQ account"
        footerText="Don't have an account?"
        footerLinkText="Sign Up"
        footerLinkHref="/signup"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <StatusAlert type="error" message={error} />}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="user-type">Login as:</Label>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="customer"
                name="userType"
                value="customer"
                checked={userType === "customer"}
                onChange={() => setUserType("customer")}
                className="form-radio h-4 w-4 text-primary"
              />
              <Label htmlFor="customer">Customer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="driver"
                name="userType"
                value="driver"
                checked={userType === "driver"}
                onChange={() => setUserType("driver")}
                className="form-radio h-4 w-4 text-primary"
              />
              <Label htmlFor="driver">Driver</Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
