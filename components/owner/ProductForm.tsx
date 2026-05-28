'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product, ProductOptionsGroup, ProductOption, Category } from '@/types'

type FullProduct = Product & {
  option_groups: (ProductOptionsGroup & { options: ProductOption[] })[]
  category?: Category
}

interface ProductManagerProps {
  initialProducts: FullProduct[]
  categories: Category[]
}

const EMPTY_FORM = {
  name: '', description: '', price: '', image_url: '', category_id: '', is_available: true, stock_count: '',
}

export function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<FullProduct | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [optionGroups, setOptionGroups] = useState<{ group_name: string; is_required: boolean; max_select: number; options: { option_name: string; additional_price: string }[] }[]>([])
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient() as any

  function openCreate() {
    setEditingProduct(null)
    setForm(EMPTY_FORM)
    setOptionGroups([])
    setShowForm(true)
    setError('')
  }

  function openEdit(product: FullProduct) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      image_url: product.image_url ?? '',
      category_id: product.category_id,
      is_available: product.is_available,
      stock_count: product.stock_count !== null ? String(product.stock_count) : '',
    })
    setOptionGroups(product.option_groups.map(g => ({
      group_name: g.group_name,
      is_required: g.is_required,
      max_select: g.max_select,
      options: (g.options ?? []).map(o => ({ option_name: o.option_name, additional_price: String(o.additional_price) })),
    })))
    setShowForm(true)
    setError('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      image_url: form.image_url.trim() || null,
      category_id: form.category_id,
      is_available: form.is_available,
      stock_count: form.stock_count !== '' ? parseInt(form.stock_count) : null,
    }

    let productId = editingProduct?.id

    if (editingProduct) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { data, error: err } = await supabase.from('products').insert(payload).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      productId = (data as Product).id
    }

    // Save option groups
    if (productId && optionGroups.length > 0) {
      if (editingProduct) {
        await supabase.from('product_options_groups').delete().eq('product_id', productId)
      }
      for (const group of optionGroups) {
        const { data: gData } = await supabase.from('product_options_groups').insert({
          product_id: productId,
          group_name: group.group_name,
          is_required: group.is_required,
          max_select: group.max_select,
        }).select().single()
        if (gData && group.options.length > 0) {
          await supabase.from('product_options').insert(
            group.options.map(o => ({ group_id: (gData as ProductOptionsGroup).id, option_name: o.option_name, additional_price: parseFloat(o.additional_price) || 0 }))
          )
        }
      }
    }

    // Refresh products
    const { data: refreshed } = await supabase.from('products').select('*, option_groups:product_options_groups(*, options:product_options(*))').order('created_at')
    setProducts((refreshed ?? []) as FullProduct[])
    setShowForm(false)
    setSaving(false)
  }

  async function toggleAvailability(product: FullProduct) {
    const { data } = await supabase.from('products').update({ is_available: !product.is_available }).eq('id', product.id).select().single()
    if (data) setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_available: !p.is_available } : p))
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = filter === 'all' ? products : products.filter(p => p.category_id === filter)

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          className="input"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openCreate} style={{ marginLeft: 'auto' }}>+ Add Product</button>
      </div>

      {/* Product list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
        {filtered.map(product => (
          <div key={product.id} className="owner-card" style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', opacity: product.is_available ? 1 : 0.55 }}>
            <div style={{ flex: 1, minWidth: '8rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--color-ink-inverse)' }}>{product.name}</div>
              <div style={{ fontFamily: 'var(--font-outlier)', fontSize: '0.875rem', color: 'var(--color-accent)' }}>₱{Number(product.price).toFixed(2)}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: product.is_available ? 'var(--color-open)' : 'oklch(55% 0.015 70)' }}>
              {product.is_available ? 'Available' : 'Unavailable'}
            </span>
            <label className="toggle" aria-label={`Toggle ${product.name} availability`}>
              <input type="checkbox" checked={product.is_available} onChange={() => toggleAvailability(product)} />
              <span className="toggle-track" />
              <span className="toggle-thumb" />
            </label>
            <button className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} onClick={() => openEdit(product)}>Edit</button>
            <button className="btn btn-danger" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} onClick={() => deleteProduct(product.id)}>Del</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: 'oklch(55% 0.015 70)', fontFamily: 'var(--font-body)', fontSize: '0.9375rem' }}>No products yet.</p>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'oklch(18% 0.020 60 / 0.45)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--color-paper-dark)', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: '36rem', maxHeight: '90dvh', overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-ink-inverse)', margin: 0, textTransform: 'uppercase' }}>
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem' }} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Name *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Description</label>
                <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Price (₱) *</label>
                  <input className="input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Stock Count</label>
                  <input className="input" type="number" min="0" value={form.stock_count} onChange={e => setForm(f => ({ ...f, stock_count: e.target.value }))} placeholder="Leave blank = unlimited" />
                </div>
              </div>
              <div>
                <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Category *</label>
                <select className="input" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} required>
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label" style={{ color: 'oklch(60% 0.015 70)' }}>Image URL</label>
                <input className="input" type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://…" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="toggle" aria-label="Is available">
                  <input type="checkbox" checked={form.is_available} onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))} />
                  <span className="toggle-track" />
                  <span className="toggle-thumb" />
                </label>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-ink-inverse)' }}>Available for order</span>
              </div>

              {/* Option groups */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-ink-inverse)', textTransform: 'uppercase' }}>Option Groups</span>
                  <button type="button" className="btn btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem' }}
                    onClick={() => setOptionGroups(g => [...g, { group_name: '', is_required: false, max_select: 1, options: [{ option_name: '', additional_price: '0' }] }])}>
                    + Add Group
                  </button>
                </div>
                {optionGroups.map((group, gi) => (
                  <div key={gi} style={{ backgroundColor: 'var(--color-paper-3)', borderRadius: 'var(--radius-md)', padding: '0.875rem', marginBottom: '0.625rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <input className="input" value={group.group_name} onChange={e => setOptionGroups(gs => gs.map((g, i) => i === gi ? { ...g, group_name: e.target.value } : g))} placeholder="Group name (e.g. Toppings)" style={{ flex: 1 }} />
                      <button type="button" onClick={() => setOptionGroups(gs => gs.filter((_, i) => i !== gi))} style={{ background: 'none', border: 'none', color: 'var(--color-accent-2)', cursor: 'pointer', fontSize: '1.125rem', padding: '0.25rem' }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'oklch(65% 0.015 70)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={group.is_required} onChange={e => setOptionGroups(gs => gs.map((g, i) => i === gi ? { ...g, is_required: e.target.checked } : g))} />
                        Required
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'oklch(65% 0.015 70)' }}>
                        Max:
                        <input type="number" min={1} value={group.max_select} onChange={e => setOptionGroups(gs => gs.map((g, i) => i === gi ? { ...g, max_select: parseInt(e.target.value) } : g))} style={{ width: '3.5rem' }} className="input" />
                      </label>
                    </div>
                    {group.options.map((opt, oi) => (
                      <div key={oi} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <input className="input" value={opt.option_name} onChange={e => setOptionGroups(gs => gs.map((g, i) => i === gi ? { ...g, options: g.options.map((o, j) => j === oi ? { ...o, option_name: e.target.value } : o) } : g))} placeholder="Option name" style={{ flex: 1 }} />
                        <input className="input" type="number" step="0.01" min="0" value={opt.additional_price} onChange={e => setOptionGroups(gs => gs.map((g, i) => i === gi ? { ...g, options: g.options.map((o, j) => j === oi ? { ...o, additional_price: e.target.value } : o) } : g))} style={{ width: '5rem' }} placeholder="+₱" />
                        <button type="button" onClick={() => setOptionGroups(gs => gs.map((g, i) => i === gi ? { ...g, options: g.options.filter((_, j) => j !== oi) } : g))} style={{ background: 'none', border: 'none', color: 'oklch(55% 0.015 70)', cursor: 'pointer' }}>✕</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem', marginTop: '0.25rem' }}
                      onClick={() => setOptionGroups(gs => gs.map((g, i) => i === gi ? { ...g, options: [...g.options, { option_name: '', additional_price: '0' }] } : g))}>
                      + Add Option
                    </button>
                  </div>
                ))}
              </div>

              {error && <p role="alert" style={{ color: 'var(--color-accent-2)', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>{error}</p>}

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <button type="submit" className={`btn btn-primary ${saving ? 'is-disabled' : ''}`} disabled={saving} style={{ flex: 1 }}>
                  {saving ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
