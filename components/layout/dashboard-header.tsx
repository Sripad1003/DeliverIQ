'use client'

import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'

interface DashboardHeaderProps {
  title: string;
  onLogout?: () => void;
}

export function DashboardHeader({ title, onLogout }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>
      {onLogout && (
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOutIcon className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      )}
    </header>
  )
}
