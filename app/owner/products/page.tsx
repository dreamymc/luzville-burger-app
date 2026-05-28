import { createClient } from '@/lib/supabase/server'
import { ProductManager } from '@/components/owner/ProductForm'
import type { Metadata } from 'next'
import type { Category } from '@/types'

export const metadata: Metadata = { title: 'Products — Luzville Owner' }
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch products with their option groups and options
  const { data: products } = await supabase
    .from('products')
    .select('*, option_groups:product_options_groups(*, options:product_options(*))')
    .order('created_at')

  // Fetch categories for filtering and setting on products
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  return (
    <div style={{ maxWidth: '48rem' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        color: 'var(--color-ink-inverse)',
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '-0.01em',
      }}>
        Products
      </h1>
      <ProductManager
        initialProducts={(products ?? []) as any}
        categories={(categories ?? []) as Category[]}
      />
    </div>
  )
}
