import type { Product, ProductOptionsGroup, ProductOption, Category } from '@/types'
import { ProductCard } from './ProductCard'

interface CatalogueSectionProps {
  category: Category
  products: (Product & {
    option_groups?: (ProductOptionsGroup & { options: ProductOption[] })[]
  })[]
}

export function CatalogueSection({ category, products }: CatalogueSectionProps) {
  if (products.length === 0) return null

  return (
    <section
      id={`category-${category.id}`}
      aria-labelledby={`cat-heading-${category.id}`}
      style={{ marginBottom: 'var(--space-12)' }}
    >
      {/* Section heading */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <h2
          id={`cat-heading-${category.id}`}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            color: 'var(--color-ink)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
          }}
        >
          {category.name}
        </h2>
        <div style={{
          flex: 1,
          height: '2px',
          backgroundColor: 'var(--color-ink)',
          minWidth: '2rem',
        }} />
      </div>

      {/* Product grid — Catalogue macrostructure */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 14rem), 1fr))',
        gap: '1rem',
      }}>
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            animationDelay={i * 60}
          />
        ))}
      </div>
    </section>
  )
}
