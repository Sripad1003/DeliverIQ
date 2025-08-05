import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  icon?: React.ElementType
  iconColorClass?: string
  titleColorClass?: string
}

export function AuthCard({ title, description, children, icon: Icon, iconColorClass, titleColorClass }: AuthCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className={`text-2xl text-center flex items-center justify-center gap-2 ${titleColorClass}`}>
          {Icon && <Icon className={`h-6 w-6 ${iconColorClass}`} />}
          <span>{title}</span>
        </CardTitle>
        {description && <CardDescription className="text-center">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
