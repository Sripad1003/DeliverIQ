"use client"

import { Button } from "../ui/button"
import { LogOut, ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from "next/link"

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
            {showBackToDashboard && (
              <Link 
                href="/admin/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Dashboard</span>
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
