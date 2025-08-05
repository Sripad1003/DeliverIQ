"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  onLogout: () => void
  homeLink?: string
}

export function DashboardHeader({ title, onLogout, homeLink = "/" }: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {homeLink &&
              homeLink !== "/" && ( // Only show back arrow if not home
                <Link href={homeLink} className="text-gray-600 hover:text-gray-900">
                  <Truck className="h-6 w-6 text-blue-600" />
                </Link>
              )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
