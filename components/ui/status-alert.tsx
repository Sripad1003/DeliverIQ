import { Alert, AlertDescription } from "./alert"
import { cn } from "../../lib/utils"

interface StatusAlertProps {
  message: {
    type: string
    text: string
  }
  className?: string
}

export function StatusAlert({ message, className }: StatusAlertProps) {
  if (!message.text) return null

  const alertClasses = {
    success: "alert-success",
    error: "alert-error", 
    warning: "alert-warning"
  }

  return (
    <Alert className={cn(alertClasses[message.type as keyof typeof alertClasses] || "alert-error", className)}>
      <AlertDescription>{message.text}</AlertDescription>
    </Alert>
  )
}
