'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/auth-card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { verifyAdminCredentials, verifyAdminSecurityKey } from '@/actions/admin-actions'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [securityKey, setSecurityKey] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const keyResult = await verifyAdminSecurityKey(securityKey);
    if (!keyResult.success) {
      toast.error('Invalid Admin Security Key.');
      setLoading(false);
      return;
    }

    const loginResult = await verifyAdminCredentials(email, password);
    if (loginResult.success && loginResult.adminId) {
      localStorage.setItem('currentAdminId', loginResult.adminId);
      toast.success('Admin login successful!');
      router.push('/admin/dashboard');
    } else {
      toast.error(loginResult.message || 'Admin login failed.');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <AuthCard
        title="Admin Login for DeliverIQ"
        description="Enter your admin credentials to access the dashboard."
        footerText="Need to set up admin access?"
        footerLinkText="Admin Setup"
        footerLinkHref="/admin/setup"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@deliveriq.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="security-key">Admin Security Key</Label>
            <Input
              id="security-key"
              type="password"
              placeholder="DELIVERIQ_ADMIN_2024"
              required
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
