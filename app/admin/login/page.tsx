import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAdmin } from "@/lib/admin-data"
import { DELIVERIQ_ADMIN_SECURITY_KEY } from "@/lib/security"
import Link from "next/link"

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <AuthCard
        title="Admin Login"
        description="Enter your credentials to access the DeliverIQ admin dashboard."
        footer={
          <div className="mt-4 text-center text-sm">
            Forgot your password?{" "}
            <Link className="underline" href="#">
              Reset
            </Link>
          </div>
        }
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="admin" required type="text" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="security-key">Admin Security Key</Label>
            <Input id="security-key" placeholder={DELIVERIQ_ADMIN_SECURITY_KEY} required type="password" />
            <p className="text-sm text-muted-foreground">Default key: `{DELIVERIQ_ADMIN_SECURITY_KEY}`</p>
          </div>
          <Button className="w-full" type="submit" formAction={loginAdmin}>
            Login
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
