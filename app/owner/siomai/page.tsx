import { createClient } from '@/lib/supabase/server'
import { SiomaiManager } from '@/components/owner/SiomaiQuickUpdate'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Siomai — Luzville Owner' }
export const dynamic = 'force-dynamic'

export default async function SiomaiPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('siomai_types').select('*').order('name')

  return (
    <div style={{ maxWidth: '36rem' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--color-ink-inverse)',
        marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '-0.01em',
      }}>
        Siomai
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'oklch(55% 0.015 70)', marginBottom: '1.5rem' }}>
        Use +10 / +1 / -1 to quickly update counts during service.
      </p>
      <SiomaiManager initialSiomai={data ?? []} />
    </div>
  )
}
