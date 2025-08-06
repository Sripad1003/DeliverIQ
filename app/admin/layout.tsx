import { ReactNode } from 'react'
import Link from 'next/link'
import { Package2Icon, HomeIcon, UsersIcon, SettingsIcon, KeyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AdminType, getAdminSession } from "@/lib/admin-data"
import { redirect } from "next/navigation"

async function AdminLayout({ children }: { children: ReactNode }) {
  const admin: AdminType | null = await getAdminSession()

  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="DeliverIQ Admin" userEmail={admin.email} />
      <main className="flex-1">{children}</main>
    </div>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
