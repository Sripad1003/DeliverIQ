'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/auth-card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createAdmin, setAdminSecurityKey, getAdminSecurityKeyHash } from '@/actions/admin-actions'
import { toast } from 'sonner'

export default function AdminSetupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityKey, setSecurityKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [isKeySet, setIsKeySet] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSecurityKey = async () => {
      const hash = await getAdminSecurityKeyHash();
      setIsKeySet(!!hash);
    };
    checkSecurityKey();
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      setLoading(false)
      return
    }

    // First, set the security key if it's not already set or if it's being updated
    if (!isKeySet || securityKey) { // Only attempt to set if not set, or if user provided a new key
      const keyResult = await setAdminSecurityKey(securityKey);
      if (!keyResult.success) {
        toast.error(keyResult.message || 'Failed to set admin security key.');
        setLoading(false);
        return;
      }
      setIsKeySet(true); // Mark key as set
    }

    // Then, create the admin account
    const adminResult = await createAdmin({ name, email, password, isActive: true });
    if (adminResult.success) {
      toast.success('Admin account and security key set up successfully!');
      router.push('/admin/login');
    } else {
      toast.error(adminResult.message || 'Failed to create admin account.');
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <AuthCard
        title="Admin Setup for DeliverIQ"
        description="Create your first admin account and set the global security key."
        footerText="Already set up?"
        footerLinkText="Admin Login"
        footerLinkHref="/admin/login"
      >
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <Label htmlFor="name">Admin Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Admin User"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Admin Email</Label>
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
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="security-key">Admin Security Key</Label>
            <Input
              id="security-key"
              type="password"
              placeholder={isKeySet ? "Key already set (leave blank to keep)" : "Set a new security key"}
              required={!isKeySet} // Required only if key is not set
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              This key is required for all admin logins. Default: `DELIVERIQ_ADMIN_2024`
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Setting Up...' : 'Complete Setup'}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
