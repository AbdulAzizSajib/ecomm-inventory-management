import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { QueryProvider } from "@/providers/query-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "HappyMart Admin",
  description: "HappyMart Admin Dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
