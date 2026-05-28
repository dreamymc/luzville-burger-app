'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SiomaiType } from '@/types'

interface SiomaiManagerProps {
  initialSiomai: SiomaiType[]
}

export function SiomaiManager({ initialSiomai }: SiomaiManagerProps) {
  const [siomaiList, setSiomaiList] = useState(initialSiomai)
  const [newName, setNewName] = useState('')
  const [newMeat, setNewMeat] = useState('')
  const [newCount, setNewCount] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const supabase = createClient() as any

  async function updateCount(siomai: SiomaiType, delta: number) {
    const newCount = Math.max(0, siomai.available_count + delta)
    setUpdatingId(siomai.id)
    const { data, error: err } = await supabase
      .from('siomai_types')
      .update({ available_count: newCount })
      .eq('id', siomai.id)
      .select()
      .single()
    if (err) setError(err.message)
    else setSiomaiList(prev => prev.map(s => s.id === siomai.id ? data as SiomaiType : s))
    setUpdatingId(null)
  }

  async function toggleAvailable(siomai: SiomaiType) {
    const { data, error: err } = await supabase
      .from('siomai_types')
      .update({ is_available: !siomai.is_available })
      .eq('id', siomai.id)
      .select()
      .single()
    if (err) setError(err.message)
    else setSiomaiList(prev => prev.map(s => s.id === siomai.id ? data as SiomaiType : s))
  }

  async function addSiomai(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newMeat.trim()) return
    const { data, error: err } = await supabase
      .from('siomai_types')
      .insert({ name: newName.trim(), meat_type: newMeat.trim(), available_count: newCount, is_available: true })
      .select()
      .single()
    if (err) { setError(err.message); return }
    setSiomaiList(prev => [...prev, data as SiomaiType])
    setNewName(''); setNewMeat(''); setNewCount(0); setShowForm(false)
  }

  return (
    <div>
      {error && <p role="alert" style={{ color: 'var(--color-accent-2)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {siomaiList.map(siomai => (
          <div key={siomai.id} className="owner-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-ink-inverse)' }}>{siomai.name}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'oklch(55% 0.015 70)' }}>{siomai.meat_type}</div>
              </div>
              <label className="toggle" aria-label={`Toggle ${siomai.name} availability`}>
                <input type="checkbox" checked={siomai.is_available} onChange={() => toggleAvailable(siomai)} />
                <span className="toggle-track" />
                <span className="toggle-thumb" />
              </label>
            </div>

            {/* Count display + quick buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-outlier)',
                fontSize: '2.5rem',
                color: siomai.is_available ? 'var(--color-accent)' : 'oklch(45% 0.015 70)',
                lineHeight: 1,
                minWidth: '4rem',
              }}>
                {updatingId === siomai.id ? '…' : siomai.available_count}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'oklch(55% 0.015 70)' }}>pcs</span>

              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                <button
                  id={`siomai-plus10-${siomai.id}`}
                  className="count-btn count-btn--plus10"
                  onClick={() => updateCount(siomai, 10)}
                  disabled={updatingId === siomai.id}
                  aria-label={`Add 10 to ${siomai.name}`}
                  style={{ width: 'auto', padding: '0 0.875rem', fontSize: '0.875rem', fontWeight: 700 }}
                >
                  +10
                </button>
                <button
                  id={`siomai-plus1-${siomai.id}`}
                  className="count-btn count-btn--plus10"
                  onClick={() => updateCount(siomai, 1)}
                  disabled={updatingId === siomai.id}
                  aria-label={`Add 1 to ${siomai.name}`}
                >
                  +1
                </button>
                <button
                  id={`siomai-minus1-${siomai.id}`}
                  className="count-btn count-btn--minus"
                  onClick={() => updateCount(siomai, -1)}
                  disabled={updatingId === siomai.id || siomai.available_count === 0}
                  aria-label={`Remove 1 from ${siomai.name}`}
                >
                  -1
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new siomai */}
      {!showForm ? (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Siomai Type</button>
      ) : (
        <form onSubmit={addSiomai} className="owner-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-ink-inverse)', fontSize: '1rem', textTransform: 'uppercase' }}>New Siomai Type</div>
          <div>
            <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Name</label>
            <input className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Chicken Siomai" required />
          </div>
          <div>
            <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Meat Type</label>
            <input className="input" value={newMeat} onChange={e => setNewMeat(e.target.value)} placeholder="e.g. Chicken" required />
          </div>
          <div>
            <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Starting Count</label>
            <input className="input" type="number" min={0} value={newCount} onChange={e => setNewCount(Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
