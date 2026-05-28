'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types'

interface CategoryManagerProps {
  initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const supabase = createClient() as any

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    const maxOrder = Math.max(0, ...categories.map(c => c.display_order))
    const { data, error: err } = await (supabase
      .from('categories') as any)
      .insert({ name: newName.trim(), display_order: maxOrder + 1, is_active: true })
      .select()
      .single()
    if (err) { setError(err.message); return }
    setCategories(prev => [...prev, data as Category])
    setNewName('')
  }

  async function toggleActive(cat: Category) {
    const { data, error: err } = await (supabase
      .from('categories') as any)
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id)
      .select()
      .single()
    if (err) { setError(err.message); return }
    setCategories(prev => prev.map(c => c.id === cat.id ? data as Category : c))
  }

  async function saveEdit(id: string) {
    if (!editingName.trim()) return
    const { data, error: err } = await (supabase
      .from('categories') as any)
      .update({ name: editingName.trim() })
      .eq('id', id)
      .select()
      .single()
    if (err) { setError(err.message); return }
    setCategories(prev => prev.map(c => c.id === id ? data as Category : c))
    setEditingId(null)
  }

  return (
    <div>
      {/* Add form */}
      <form onSubmit={addCategory} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          className="input"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New category name…"
          style={{ flex: 1, minWidth: '12rem' }}
        />
        <button type="submit" className="btn btn-primary" disabled={!newName.trim()}>
          + Add
        </button>
      </form>

      {error && <p role="alert" style={{ color: 'var(--color-accent-2)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {categories.sort((a, b) => a.display_order - b.display_order).map(cat => (
          <div key={cat.id} className="owner-card" style={{
            padding: '0.875rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            opacity: cat.is_active ? 1 : 0.55,
          }}>
            {editingId === cat.id ? (
              <>
                <input
                  className="input"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  style={{ flex: 1, fontSize: '0.9375rem' }}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') setEditingId(null) }}
                />
                <button className="btn btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.875rem' }} onClick={() => saveEdit(cat.id)}>Save</button>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.875rem', fontSize: '0.875rem' }} onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-ink-inverse)', fontSize: '0.9375rem' }}>
                  {cat.name}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: cat.is_active ? 'var(--color-open)' : 'oklch(55% 0.015 70)' }}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </span>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                  onClick={() => { setEditingId(cat.id); setEditingName(cat.name) }}
                >
                  Edit
                </button>
                <label className="toggle" aria-label={`Toggle ${cat.name} active`}>
                  <input type="checkbox" checked={cat.is_active} onChange={() => toggleActive(cat)} />
                  <span className="toggle-track" />
                  <span className="toggle-thumb" />
                </label>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
