import type { Category } from '@/types'

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const active = categories.filter(c => c.is_active)
  if (active.length === 0) return null

  return (
    <nav aria-label="Product categories" style={{
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-paper)',
      position: 'sticky',
      top: '4rem',
      zIndex: 30,
    }}>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        width: 'max-content',
        margin: '0 auto',
        maxWidth: '72rem',
      }}>
        {active.map(cat => (
          <a
            key={cat.id}
            href={`#category-${cat.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              backgroundColor: 'var(--color-paper-2)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-ink)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background-color 150ms ease-out, border-color 150ms ease-out',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.backgroundColor = 'var(--color-accent)'
              el.style.borderColor = 'var(--color-accent)'
              el.style.color = 'var(--color-paper)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.backgroundColor = 'var(--color-paper-2)'
              el.style.borderColor = 'var(--color-border)'
              el.style.color = 'var(--color-ink)'
            }}
          >
            {cat.name}
          </a>
        ))}
      </div>
    </nav>
  )
}
