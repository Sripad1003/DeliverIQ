"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"
import { StatusAlert } from "@/components/ui/status-alert" // Import StatusAlert
import { initializeAdminData, getAdminData, setAdminData, createAdmin, getAdminDashboardData } from "@/lib/admin-data"
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, TrashIcon } from "lucide-react"
import Link from "next/link"

export default async function ManageAdminsPage() {
  const { admins } = await getAdminDashboardData()
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
  const [adminList, setAdmins] = useState([]) // Declare setAdmins

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

      const updatedAdmins = [...adminList, newAdminData]
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
    const updatedAdmins = adminList.map((admin) =>
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
    const updatedAdmins = adminList.filter((admin) => admin.id !== adminId)
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
      <PageHeaderWithBack
        title="Manage Admins"
        description="Add, remove, or modify administrator accounts for DeliverIQ."
        backHref="/admin/dashboard"
      >
        <Button asChild size="sm">
          <Link href="#" onClick={() => setIsCreateDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Admin
          </Link>
        </Button>
      </PageHeaderWithBack>

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
            <CardTitle>Admin Accounts</CardTitle>
            <CardDescription>A list of all administrators in the DeliverIQ system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminList.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.role}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteAdmin(admin.id)}>
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
      </main>
    </div>
  )
}
