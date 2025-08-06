'use client'

import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react"
import { seedDatabase } from "@/actions/db-actions"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

// Metadata is a server-only export, so it cannot be directly in a 'use client' component.
// For client components, you'd typically manage title/description via react-helmet or similar.
// For simplicity in this example, we'll keep it here but note the limitation.
// In a real app, you'd define metadata in a server component layout.
export const metadata: Metadata = {
  title: "DeliverIQ",
  description: "Your ultimate delivery and logistics solution.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    // Seed the database on initial load if not already seeded
    const hasSeeded = localStorage.getItem('dbSeeded');
    if (!hasSeeded) {
      seedDatabase().then(() => {
        localStorage.setItem('dbSeeded', 'true');
        console.log('Database seeding initiated.');
      }).catch(error => {
        console.error('Database seeding failed:', error);
      });
    }
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
