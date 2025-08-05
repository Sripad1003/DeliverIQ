"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logoutAdmin } from "@/lib/admin-data"
import { logoutUser } from "@/lib/app-data"
import { logoutDriver } from "@/lib/vehicle-logic"
import { CircleUserIcon, MenuIcon, Package2Icon } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  userType: "customer" | "driver" | "admin"
  userName: string
  navItems: { href: string; label: string }[]
}

export function DashboardHeader({ userType, userName, navItems }: DashboardHeaderProps) {
  const handleLogout = async () => {
    if (userType === "customer") {
      await logoutUser()
    } else if (userType === "driver") {
      await logoutDriver()
    } else if (userType === "admin") {
      await logoutAdmin()
    }
  }

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="#">
          <Package2Icon className="h-6 w-6" />
          <span className="sr-only">DeliverIQ</span>
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="shrink-0 md:hidden bg-transparent" size="icon" variant="outline">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
              <Package2Icon className="h-6 w-6" />
              <span className="sr-only">DeliverIQ</span>
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} className="hover:text-foreground" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">{/* Search or other elements can go here */}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full" size="icon" variant="secondary">
              <CircleUserIcon className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
