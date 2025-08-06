'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatusAlert } from "@/components/ui/status-alert"
import { adminLogin } from "@/actions/admin-actions"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [securityKey, setSecurityKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await adminLogin(email, password, securityKey)
      if (result.success) {
        toast.success("Admin login successful!")
        router.push("/admin/dashboard")
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
        title="Admin Login"
        description="Access the DeliverIQ Admin Dashboard"
        footerText="Don't have admin access?"
        footerLinkText="Contact support"
        footerLinkHref="#"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <StatusAlert type="error" message={error} />}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@deliveriq.com"
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
          <div>
            <Label htmlFor="security-key">Admin Security Key</Label>
            <Input
              id="security-key"
              type="password"
              placeholder="DELIVERIQ_ADMIN_2024"
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">Default: DELIVERIQ_ADMIN_2024</p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
