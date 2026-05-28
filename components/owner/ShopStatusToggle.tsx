'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ShopStatus } from '@/types'

interface ShopStatusToggleProps {
  initial: ShopStatus | null
}

export function ShopStatusToggle({ initial }: ShopStatusToggleProps) {
  const [status, setStatus] = useState<ShopStatus | null>(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isOpen = status?.is_open ?? false

  const toggle = useCallback(async () => {
    setLoading(true)
    setError('')
    const supabase = createClient() as any
    const { data, error: err } = await supabase
      .from('shop_status')
      .update({ is_open: !isOpen })
      .eq('id', 1)
      .select()
      .single()

    if (err) {
      setError('Failed to update status. Try again.')
    } else {
      setStatus(data as ShopStatus)
    }
    setLoading(false)
  }, [isOpen])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* Giant status display */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'clamp(3rem, 12vw, 5rem)',
        color: isOpen ? 'var(--color-open)' : 'var(--color-closed)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        transition: 'color 300ms ease-in-out',
        textTransform: 'uppercase',
      }}>
        {isOpen ? 'OPEN' : 'CLOSED'}
      </div>

      {status?.updated_at && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'oklch(55% 0.015 70)', margin: 0 }}>
          Last updated: {new Date(status.updated_at).toLocaleTimeString()}
        </p>
      )}

      {/* Toggle button */}
      <button
        id="shop-status-toggle"
        onClick={toggle}
        disabled={loading}
        className={`btn ${isOpen ? 'btn-danger' : 'btn-primary'} ${loading ? 'is-disabled' : ''}`}
        style={{
          padding: '1rem 2.5rem',
          fontSize: '1.125rem',
          borderRadius: 'var(--radius-lg)',
          minWidth: '14rem',
        }}
        aria-label={`Toggle shop to ${isOpen ? 'closed' : 'open'}`}
      >
        {loading ? (
          <><span className="spinner" /> Updating…</>
        ) : (
          isOpen ? '🔒 Close Shop' : '🟢 Open Shop'
        )}
      </button>

      {error && (
        <p role="alert" style={{ color: 'var(--color-accent-2)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
          {error}
        </p>
      )}
    </div>
  )
}
