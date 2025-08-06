'use client'

import { useEffect, useState } from "react"
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminType } from "@/lib/admin-data"
import { createAdmin, deleteAdmin, getAdmins, updateAdminStatus } from "@/actions/admin-actions"
import { toast } from "sonner"
import { StatusAlert } from "@/components/ui/status-alert"

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminType[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [newAdminSecurityKey, setNewAdminSecurityKey] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addAdminError, setAddAdminError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedAdmins = await getAdmins()
      setAdmins(fetchedAdmins)
    } catch (err) {
      console.error("Failed to fetch admins:", err)
      setError("Failed to load admin list. Please try again.")
      toast.error("Failed to load admin list.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddAdminError(null)
    if (!newAdminEmail || !newAdminPassword || !newAdminSecurityKey) {
      setAddAdminError("All fields are required.")
      return
    }

    try {
      const result = await createAdmin(newAdminEmail, newAdminPassword, newAdminSecurityKey)
      if (result.success) {
        toast.success("Admin added successfully!")
        setNewAdminEmail("")
        setNewAdminPassword("")
        setNewAdminSecurityKey("")
        fetchAdmins() // Refresh the list
      } else {
        setAddAdminError(result.message)
        toast.error(result.message)
      }
    } catch (err) {
      console.error("Add admin error:", err)
      setAddAdminError("An unexpected error occurred while adding admin.")
      toast.error("An unexpected error occurred.")
    }
  }

  const handleUpdateStatus = async (adminId: string, status: "active" | "inactive") => {
    try {
      const result = await updateAdminStatus(adminId, status)
      if (result.success) {
        toast.success(`Admin status updated to ${status}.`)
        fetchAdmins() // Refresh the list
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      console.error("Update status error:", err)
      toast.error("An unexpected error occurred while updating status.")
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const result = await deleteAdmin(adminId)
        if (result.success) {
          toast.success("Admin deleted successfully!")
          fetchAdmins() // Refresh the list
        } else {
          toast.error(result.message)
        }
      } catch (err) {
        console.error("Delete admin error:", err)
        toast.error("An unexpected error occurred while deleting admin.")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <PageHeaderWithBack title="Manage Admins" backHref="/admin/dashboard" />
        <main className="flex-1 p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Existing Admins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded animate-pulse">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p>{error}</p>
        <Button onClick={fetchAdmins} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <PageHeaderWithBack title="Manage Admins" backHref="/admin/dashboard" />
      <main className="flex-1 p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              {addAdminError && <StatusAlert type="error" message={addAdminError} />}
              <div>
                <Label htmlFor="new-admin-email">Email</Label>
                <Input
                  id="new-admin-email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="newadmin@deliveriq.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-admin-password">Password</Label>
                <Input
                  id="new-admin-password"
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-admin-security-key">Admin Security Key</Label>
                <Input
                  id="new-admin-security-key"
                  type="password"
                  value={newAdminSecurityKey}
                  onChange={(e) => setNewAdminSecurityKey(e.target.value)}
                  placeholder="DELIVERIQ_ADMIN_2024"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Admin
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Admins</CardTitle>
          </CardHeader>
          <CardContent>
            {admins.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No admins found.</p>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin._id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{admin.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status: {admin.status}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={admin.status}
                        onValueChange={(value: "active" | "inactive") => handleUpdateStatus(admin._id!, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteAdmin(admin._id!)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
