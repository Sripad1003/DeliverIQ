import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ReactNode } from "react"

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
  footerText: string
  footerLinkText: string
  footerLinkHref: string
}

export function AuthCard({ title, description, children, footerText, footerLinkText, footerLinkHref }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col">
        {footerText}
        <Link href={footerLinkHref} className="underline">
          {footerLinkText}
        </Link>
      </CardFooter>
    </Card>
  )
}
