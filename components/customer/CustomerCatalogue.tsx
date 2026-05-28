'use client'

import { RealtimeProvider } from '@/components/customer/RealtimeProvider'
import { Header } from '@/components/layout/Header'
import { ShopClosedBanner } from '@/components/customer/ShopClosedBanner'
import { CategoryNav } from '@/components/customer/CategoryNav'
import { CatalogueSection } from '@/components/customer/CatalogueSection'
import { SiomaiSection } from '@/components/customer/SiomaiSection'
import type { ShopStatus, Category, ProductWithOptions, SiomaiType } from '@/types'

interface CustomerCatalogueProps {
  initialData: {
    shopStatus: ShopStatus | null
    categories: Category[]
    products: ProductWithOptions[]
    siomaiTypes: SiomaiType[]
  }
}

export function CustomerCatalogue({ initialData }: CustomerCatalogueProps) {
  const { categories } = initialData

  return (
    <RealtimeProvider
      initial={{
        shopStatus: initialData.shopStatus,
        siomaiTypes: initialData.siomaiTypes,
        products: initialData.products,
      }}
    >
      {(state) => {
        // Group products by category
        const productsByCategory = categories.reduce<Record<string, ProductWithOptions[]>>(
          (acc, cat) => {
            acc[cat.id] = state.products.filter(p => p.category_id === cat.id)
            return acc
          },
          {}
        )

        return (
          <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-paper)' }}>
            <Header shopStatus={state.shopStatus} />

            {!state.shopStatus?.is_open && <ShopClosedBanner />}

            <CategoryNav categories={categories} />

            <main
              style={{
                maxWidth: '72rem',
                margin: '0 auto',
                padding: '2rem 1rem 4rem',
              }}
            >
              {/* Siomai section first if it's a named category, otherwise after burgers */}
              {categories.map(category => {
                if (category.name.toLowerCase() === 'siomai') {
                  return (
                    <section
                      key={category.id}
                      id={`category-${category.id}`}
                      aria-label="Siomai"
                      style={{ marginBottom: 'var(--space-12)' }}
                    >
                      <SiomaiSection siomaiTypes={state.siomaiTypes} />
                    </section>
                  )
                }
                const catProducts = productsByCategory[category.id] ?? []
                // For realtime — merge availability updates
                const mergedProducts = catProducts.map(p => {
                  const updated = state.products.find(sp => sp.id === p.id)
                  return updated ? { ...p, ...updated } : p
                })
                return (
                  <CatalogueSection
                    key={category.id}
                    category={category}
                    products={mergedProducts}
                  />
                )
              })}

              {categories.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-ink-3)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
                    Menu coming soon!
                  </p>
                </div>
              )}
            </main>

            {/* Footer — Ft8 Marquee scroll */}
            <footer style={{
              borderTop: '2px solid var(--color-ink)',
              backgroundColor: 'var(--color-ink)',
              overflow: 'hidden',
              padding: '1rem 0',
            }}>
              <div className="marquee-track" aria-hidden="true">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--color-accent)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '0 2rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Open Daily · Fresh Burgers · Pork &amp; Shrimp Siomai · Order at the Stall ·&nbsp;
                  </span>
                ))}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'oklch(70% 0.015 75)',
                textAlign: 'center',
                margin: '0.5rem 0 0',
              }}>
                © {new Date().getFullYear()} Luzville Food Stall
              </p>
            </footer>
          </div>
        )
      }}
    </RealtimeProvider>
  )
}
