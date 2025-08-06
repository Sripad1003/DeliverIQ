'use client'

import { useState, useEffect } from "react"
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusAlert } from "@/components/ui/status-alert"
import { getSecurityKey, setSecurityKey } from "@/actions/admin-actions"
import { toast } from "sonner"

export default function AdminSetupPage() {
  const [currentKey, setCurrentKey] = useState("")
  const [newKey, setNewKey] = useState("")
  const [confirmNewKey, setConfirmNewKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSecurityKey()
  }, [])

  const fetchSecurityKey = async () => {
    setLoading(true)
    setError(null)
    try {
      const key = await getSecurityKey()
      setCurrentKey(key || "Not set") // Display "Not set" if no key is found
    } catch (err) {
      console.error("Failed to fetch security key:", err)
      setError("Failed to load current security key.")
      toast.error("Failed to load current security key.")
    } finally {
      setLoading(false)
    }
  }

  const handleSetSecurityKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSaving(true)

    if (newKey !== confirmNewKey) {
      setError("New security key and confirmation do not match.")
      setIsSaving(false)
      return
    }
    if (!newKey) {
      setError("New security key cannot be empty.")
      setIsSaving(false)
      return
    }

    try {
      const result = await setSecurityKey(newKey)
      if (result.success) {
        setSuccess("Admin security key updated successfully!")
        toast.success("Admin security key updated!")
        setNewKey("")
        setConfirmNewKey("")
        fetchSecurityKey() // Refresh the displayed key
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (err) {
      console.error("Set security key error:", err)
      setError("An unexpected error occurred while updating the security key.")
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <PageHeaderWithBack title="Admin Setup" backHref="/admin/dashboard" />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Security Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error && !success) { // Only show error if no success message is present
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p>{error}</p>
        <Button onClick={fetchSecurityKey} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <PageHeaderWithBack title="Admin Setup" backHref="/admin/dashboard" />
      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Security Key</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label>Current Key:</Label>
              <p className="font-bold text-lg">{currentKey}</p>
            </div>
            <form onSubmit={handleSetSecurityKey} className="space-y-4">
              {error && <StatusAlert type="error" message={error} />}
              {success && <StatusAlert type="success" message={success} />}
              <div>
                <Label htmlFor="new-key">New Security Key</Label>
                <Input
                  id="new-key"
                  type="password"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Enter new security key"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-new-key">Confirm New Security Key</Label>
                <Input
                  id="confirm-new-key"
                  type="password"
                  value={confirmNewKey}
                  onChange={(e) => setConfirmNewKey(e.target.value)}
                  placeholder="Confirm new security key"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : "Set New Key"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
