'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/auth-card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginCustomer, loginDriver } from '@/lib/app-data'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'customer' | 'driver'>('customer')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let result;
    if (userType === 'customer') {
      result = await loginCustomer(email, password)
      if (result.success && result.customerId) {
        localStorage.setItem('currentUserId', result.customerId);
        localStorage.setItem('currentUserType', 'customer');
        toast.success('Customer login successful!')
        router.push('/customer/dashboard')
      } else {
        toast.error(result.message || 'Customer login failed.')
      }
    } else { // userType === 'driver'
      result = await loginDriver(email, password)
      if (result.success && result.driverId) {
        localStorage.setItem('currentUserId', result.driverId);
        localStorage.setItem('currentUserType', 'driver');
        toast.success('Driver login successful!')
        router.push('/driver/dashboard')
      } else {
        toast.error(result.message || 'Driver login failed.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <AuthCard
        title="Login to DeliverIQ"
        description="Enter your credentials to access your account."
        footerText="Don't have an account?"
        footerLinkText="Sign Up"
        footerLinkHref="/signup"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
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
          <div className="flex items-center space-x-4">
            <Label htmlFor="user-type">Login as:</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={userType === 'customer' ? 'default' : 'outline'}
                onClick={() => setUserType('customer')}
              >
                Customer
              </Button>
              <Button
                type="button"
                variant={userType === 'driver' ? 'default' : 'outline'}
                onClick={() => setUserType('driver')}
              >
                Driver
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
