import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luzville Burger App',
  description: 'Fresh burgers, siomai, and more — Luzville Food Stall',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
