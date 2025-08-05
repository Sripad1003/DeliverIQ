import type React from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { getAdminDashboardData } from "@/lib/admin-data"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { adminName } = await getAdminDashboardData()
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader
        userType="admin"
        userName={adminName}
        navItems={[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/manage-admins", label: "Manage Admins" },
          { href: "/admin/setup", label: "Setup" },
        ]}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
    </div>
  )
}
