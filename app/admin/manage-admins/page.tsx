"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, UserPlus, Trash2 } from "lucide-react"
import { StatusAlert } from "@/components/ui/status-alert" // Import StatusAlert
import { DashboardHeader } from "@/components/layout/dashboard-header" // Import DashboardHeader
import { initializeAdminData, getAdminData, setAdminData, createAdmin } from "@/lib/admin-data"

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState([
    {
      id: "1",
      name: "Super Admin",
      email: "admin@trolla.com",
      createdAt: "2024-01-01",
      createdBy: "System",
      status: "active",
    },
  ])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated admin
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    // Initialize and load admin data
    initializeAdminData()
    const loadedAdmins = getAdminData()
    setAdmins(loadedAdmins)
  }, [router])

  const persistAdmins = (adminData) => {
    setAdminData(adminData)
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setMessage({ type: "error", text: "Passwords don't match" })
      setIsLoading(false)
      return
    }

    if (newAdmin.password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long" })
      setIsLoading(false)
      return
    }

    try {
      // Create admin with hashed password
      const newAdminData = await createAdmin({
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
      })

      const updatedAdmins = [...admins, newAdminData]
      setAdmins(updatedAdmins)
      persistAdmins(updatedAdmins)

      setMessage({ type: "success", text: "Admin account created successfully with encrypted password" })
      setNewAdmin({ name: "", email: "", password: "", confirmPassword: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create admin account" })
    }

    setIsLoading(false)
  }

  const handleSuspendAdmin = (adminId) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === adminId ? { ...admin, status: admin.status === "active" ? "suspended" : "active" } : admin,
    )
    setAdmins(updatedAdmins)
    persistAdmins(updatedAdmins) // Persist to localStorage
  }

  const handleDeleteAdmin = (adminId) => {
    if (adminId === "1") {
      setMessage({ type: "error", text: "Cannot delete the super admin account" })
      return
    }
    const updatedAdmins = admins.filter((admin) => admin.id !== adminId)
    setAdmins(updatedAdmins)
    persistAdmins(updatedAdmins) // Persist to localStorage
    setMessage({ type: "success", text: "Admin account deleted successfully" })
  }

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Admin Management" onLogout={handleLogout} homeLink="/admin/dashboard" />

      <main className="container mx-auto px-4 py-8">
        <StatusAlert
          message={{
            type: "warning",
            text: "Security Notice: Only create admin accounts for trusted personnel. All admin activities are logged and monitored.",
          }}
          className="mb-6 border-red-200 bg-red-50 text-red-800"
        />

        <StatusAlert message={message} />

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Administrator Accounts</CardTitle>
                <CardDescription>Manage admin access to the Trolla platform</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Admin Account</DialogTitle>
                    <DialogDescription>Create a new administrator account with full platform access.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create secure password (min 8 chars)"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin((prev) => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={newAdmin.confirmPassword}
                        onChange={(e) => setNewAdmin((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                        {isLoading ? "Creating..." : "Create Admin"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-8 w-8 text-red-600" />
                    <div>
                      <h3 className="font-semibold">{admin.name}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <p className="text-xs text-gray-500">
                        Created: {admin.createdAt} by {admin.createdBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={admin.status === "active" ? "default" : "secondary"}
                      className={admin.status === "active" ? "bg-green-600" : "bg-gray-500"}
                    >
                      {admin.status}
                    </Badge>
                    {admin.id !== "1" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleSuspendAdmin(admin.id)}>
                          {admin.status === "active" ? "Suspend" : "Activate"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteAdmin(admin.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {admin.id === "1" && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Super Admin
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
