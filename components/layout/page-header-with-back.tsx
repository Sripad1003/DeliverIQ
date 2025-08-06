import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'

interface PageHeaderWithBackProps {
  title: string;
  backHref: string;
}

export function PageHeaderWithBack({ title, backHref }: PageHeaderWithBackProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
      <Link href={backHref}>
        <Button variant="ghost" size="icon">
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>
    </header>
  )
}
