"use client"

import { Button } from "../ui/button"
import { LogOut, ArrowLeft, LayoutDashboard ,Home} from 'lucide-react'
import Link from "next/link"
import { PageHeaderWithBack } from "./page-header-with-back"

interface DashboardHeaderProps {
  title: string
  onLogout: () => void
  showBackToDashboard?: boolean
}

export function DashboardHeader({ title, onLogout, showBackToDashboard = false }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-750">
              <Home/>
              Home
            </Link>
            {showBackToDashboard && (
              <Link 
                href="/admin/dashboard"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-750 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <Button 
            onClick={onLogout} 
            variant="outline" 
            className="flex items-center space-x-2 hover:bg-red-50 hover:text-blue-600 hover:border-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
