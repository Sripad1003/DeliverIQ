import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type React from "react"

interface AuthCardProps {
  title: string
  description: React.ReactNode
  children: React.ReactNode
  icon?: React.ElementType
  iconColorClass?: string
  titleColorClass?: string
}

export function AuthCard({ 
  title, 
  description, 
  children, 
  icon: Icon, 
  iconColorClass = "text-blue-600",
  titleColorClass = "text-gray-900"
}: AuthCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        {Icon && (
          <div className="flex justify-center mb-4">
            <Icon className={cn("w-8 h-8", iconColorClass)} />
          </div>
        )}
        <CardTitle className={cn("text-2xl font-bold", titleColorClass)}>{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
