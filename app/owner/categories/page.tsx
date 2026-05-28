import { createClient } from '@/lib/supabase/server'
import { CategoryManager } from '@/components/owner/CategoryForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Categories — Luzville Owner' }
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('display_order')

  return (
    <div style={{ maxWidth: '36rem' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--color-ink-inverse)',
        marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.01em',
      }}>
        Categories
      </h1>
      <CategoryManager initialCategories={data ?? []} />
    </div>
  )
}
