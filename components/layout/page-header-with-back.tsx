'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from 'lucide-react'

interface PageHeaderWithBackProps {
  title: string
  backHref: string
}

export function PageHeaderWithBack({ title, backHref }: PageHeaderWithBackProps) {
  const router = useRouter()

  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => router.push(backHref)}>
        <ArrowLeftIcon className="h-6 w-6" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
    </header>
  )
}
