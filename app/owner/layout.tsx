import { OwnerNav } from '@/components/layout/OwnerNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luzville — Owner Dashboard',
  description: 'Manage your Luzville food stall.',
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="owner-surface"
      style={{
        display: 'flex',
        minHeight: '100dvh',
      }}
    >
      <OwnerNav />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: '1.5rem 1rem 6rem', // bottom padding for mobile nav
          overflowX: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
