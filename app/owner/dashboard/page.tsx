import { createClient } from '@/lib/supabase/server'
import { ShopStatusToggle } from '@/components/owner/ShopStatusToggle'
import type { Metadata } from 'next'
import type { ShopStatus } from '@/types'

export const metadata: Metadata = { title: 'Dashboard — Luzville Owner' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { data: shopStatus },
    { count: productCount },
    { count: siomaiCount },
  ] = await Promise.all([
    supabase.from('shop_status').select('*').single(),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('siomai_types').select('*', { count: 'exact', head: true }).eq('is_available', true),
  ])

  const summaryCards = [
    { label: 'Total Products', value: productCount ?? 0, icon: '🍔' },
    { label: 'Active Siomai Types', value: siomaiCount ?? 0, icon: '🥟' },
  ]

  return (
    <div style={{ maxWidth: '32rem' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        color: 'var(--color-ink-inverse)',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
      }}>
        Dashboard
      </h1>

      {/* Shop Status Toggle — main action */}
      <div className="owner-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
        <ShopStatusToggle initial={shopStatus as ShopStatus | null} />
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {summaryCards.map(card => (
          <div key={card.label} className="owner-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }} aria-hidden="true">{card.icon}</div>
            <div style={{ fontFamily: 'var(--font-outlier)', fontSize: '2rem', color: 'var(--color-accent)', lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'oklch(60% 0.015 70)', marginTop: '0.25rem' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
