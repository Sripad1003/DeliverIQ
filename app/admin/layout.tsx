import { ReactNode } from 'react'
import Link from 'next/link'
import { Package2Icon, HomeIcon, UsersIcon, SettingsIcon, KeyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 md:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/admin/dashboard">
              <Package2Icon className="h-6 w-6" />
              <span className="sr-only">DeliverIQ Admin</span>
              <span>DeliverIQ Admin</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50"
                href="/admin/dashboard"
              >
                <HomeIcon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/admin/manage-admins"
              >
                <UsersIcon className="h-4 w-4" />
                Manage Admins
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/admin/setup"
              >
                <KeyIcon className="h-4 w-4" />
                Admin Security Key
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="outline">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link className="flex items-center gap-2 font-semibold" href="/admin/dashboard">
                <Package2Icon className="h-6 w-6" />
                <span className="sr-only">DeliverIQ Admin</span>
                <span>DeliverIQ Admin</span>
              </Link>
              <nav className="grid gap-2 text-lg font-medium">
                <Link className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-gray-900 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-50" href="/admin/dashboard">
                  <HomeIcon className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/admin/manage-admins">
                  <UsersIcon className="h-5 w-5" />
                  Manage Admins
                </Link>
                <Link className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/admin/setup">
                  <KeyIcon className="h-5 w-5" />
                  Admin Security Key
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
        </header>
        {children}
      </div>
    </div>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
