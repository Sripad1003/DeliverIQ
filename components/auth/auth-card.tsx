import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthCard({ title, description, children, footerText, footerLinkText, footerLinkHref }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <p className="text-center text-gray-500 dark:text-gray-400">
          {footerText}{' '}
          <Link className="font-medium underline" href={footerLinkHref}>
            {footerLinkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
