'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/auth-card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registerCustomer, registerDriver } from '@/lib/app-data'
import { toast } from 'sonner'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [userType, setUserType] = useState<'customer' | 'driver'>('customer')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let result;
    if (userType === 'customer') {
      result = await registerCustomer({ name, email, password, phone, address })
      if (result.success) {
        toast.success('Customer account created successfully!')
        router.push('/login')
      } else {
        toast.error(result.message || 'Customer signup failed.')
      }
    } else { // userType === 'driver'
      result = await registerDriver({ name, email, password, phone, vehicle })
      if (result.success) {
        toast.success('Driver account created successfully!')
        router.push('/login')
      } else {
        toast.error(result.message || 'Driver signup failed.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <AuthCard
        title="Sign Up for DeliverIQ"
        description="Create your account to get started."
        footerText="Already have an account?"
        footerLinkText="Login"
        footerLinkHref="/login"
      >
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="555-123-4567"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="user-type">Register as:</Label>
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
          {userType === 'customer' && (
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}
          {userType === 'driver' && (
            <div>
              <Label htmlFor="vehicle">Vehicle Type</Label>
              <Input
                id="vehicle"
                type="text"
                placeholder="Motorcycle, Car, Van, etc."
                required
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
