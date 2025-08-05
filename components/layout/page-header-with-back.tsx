import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import type React from "react"

interface PageHeaderWithBackProps {
  title: string
  description: string
  backHref: string
  children?: React.ReactNode
}

export function PageHeaderWithBack({ title, description, backHref, children }: PageHeaderWithBackProps) {
  return (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
        <Link href={backHref}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Link>
      </Button>
      <div className="grid gap-1">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="ml-auto">{children}</div>}
    </div>
  )
}
