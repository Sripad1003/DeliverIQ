import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface StatusAlertProps {
  message: { type: string; text: string }
  className?: string
}

export function StatusAlert({ message, className }: StatusAlertProps) {
  if (!message.text) return null

  const isError = message.type === "error"
  const alertClass = isError ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
  const iconClass = isError ? "text-red-600" : "text-green-600"
  const descriptionClass = isError ? "text-red-800" : "text-green-800"

  return (
    <Alert className={`mb-6 ${alertClass} ${className}`}>
      {isError ? (
        <AlertTriangle className={`h-4 w-4 ${iconClass}`} />
      ) : (
        <CheckCircle className={`h-4 w-4 ${iconClass}`} />
      )}
      <AlertDescription className={descriptionClass}>{message.text}</AlertDescription>
    </Alert>
  )
}
