import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CustomerCatalogue } from '@/components/customer/CustomerCatalogue'
import type { ShopStatus, Category, ProductWithOptions, SiomaiType } from '@/types'

export const metadata: Metadata = {
  title: 'Luzville Burger App — Fresh Burgers & More',
  description: 'Browse our menu of fresh burgers, siomai, snacks, and more at Luzville Food Stall.',
}

export const dynamic = 'force-dynamic'

export default async function CustomerPage() {
  const supabase = await createClient()

  // Fetch all initial data server-side
  const [
    { data: shopStatusData },
    { data: categoriesData },
    { data: productsData },
    { data: siomaiData },
  ] = await Promise.all([
    supabase.from('shop_status').select('*').single(),
    supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
    supabase.from('products').select(`
      *,
      option_groups:product_options_groups(
        *,
        options:product_options(*)
      )
    `).eq('is_available', true).order('created_at'),
    supabase.from('siomai_types').select('*').order('name'),
  ])

  const shopStatus = shopStatusData as ShopStatus | null
  const categories = (categoriesData ?? []) as Category[]
  const products = (productsData ?? []) as ProductWithOptions[]
  const siomaiTypes = (siomaiData ?? []) as SiomaiType[]

  return (
    <CustomerCatalogue
      initialData={{
        shopStatus,
        categories,
        products,
        siomaiTypes,
      }}
    />
  )
}
