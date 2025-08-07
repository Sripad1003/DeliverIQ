import Link from "next/link"
import { ArrowLeft, Truck } from 'lucide-react'
import { cn } from "../../lib/utils"
import type React from "react"

interface PageHeaderWithBackProps {
  title: string
  backLink: string
  icon?: React.ElementType
  description?: string
  iconColorClass?: string
}

export function PageHeaderWithBack({
  title,
  backLink,
  icon: Icon,
  description,
  iconColorClass = "text-blue-600",
}: PageHeaderWithBackProps) {
  return (
    <div className="text-center mb-8">
      <Link href={backLink} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
      <div className="flex items-center justify-center space-x-2 mb-4">
        {Icon ? <Icon className={cn("h-8 w-8", iconColorClass)} /> : <Truck className="h-8 w-8 text-blue-600" />}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  )
}
