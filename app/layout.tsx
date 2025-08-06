import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import SeedInitializer from "@/components/seed-initializer" // Import the new client component

const inter = Inter({ subsets: ["latin"] })

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SeedInitializer /> {/* Render the client component here */}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
