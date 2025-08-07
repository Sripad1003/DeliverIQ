import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "badge #374151",
    secondary: "badge #6b7280", 
    destructive: "badge bg-red-600",
    outline: "badge border border-gray-200 bg-white text-gray-900"
  }

  return (
    <div className={cn(variantClasses[variant], className)} {...props} />
  )
}

export { Badge }
