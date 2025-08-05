import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/lib/app-data"
import { cn } from "@/lib/utils"
import { CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon } from "lucide-react"
import type React from "react"

interface StatusAlertProps {
  status: OrderStatus
}

export function StatusAlert({ status }: StatusAlertProps) {
  let icon: React.ReactNode
  let variant: "default" | "secondary" | "destructive" | "outline"
  let label: string

  switch (status) {
    case OrderStatus.Pending:
      icon = <ClockIcon className="h-4 w-4" />
      variant = "secondary"
      label = "Pending"
      break
    case OrderStatus.Assigned:
      icon = <TruckIcon className="h-4 w-4" />
      variant = "default"
      label = "Assigned"
      break
    case OrderStatus.InProgress:
      icon = <TruckIcon className="h-4 w-4" />
      variant = "default"
      label = "In Progress"
      break
    case OrderStatus.Completed:
      icon = <CheckCircleIcon className="h-4 w-4" />
      variant = "default"
      label = "Completed"
      break
    case OrderStatus.Cancelled:
      icon = <XCircleIcon className="h-4 w-4" />
      variant = "destructive"
      label = "Cancelled"
      break
    default:
      icon = null
      variant = "outline"
      label = "Unknown"
  }

  return (
    <Badge className={cn("flex items-center gap-1 px-2 py-1 text-xs font-medium")} variant={variant}>
      {icon}
      {label}
    </Badge>
  )
}
