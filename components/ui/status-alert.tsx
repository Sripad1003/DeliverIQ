import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircleIcon, XCircleIcon, InfoIcon } from 'lucide-react'

interface StatusAlertProps {
  type: "success" | "error" | "info"
  message: string
  title?: string
}

export function StatusAlert({ type, message, title }: StatusAlertProps) {
  const Icon =
    type === "success"
      ? CheckCircleIcon
      : type === "error"
      ? XCircleIcon
      : InfoIcon

  const variant = type === "error" ? "destructive" : "default"

  return (
    <Alert variant={variant}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title || (type === "success" ? "Success" : type === "error" ? "Error" : "Info")}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
