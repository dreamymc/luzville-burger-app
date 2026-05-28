import type { SiomaiType } from '@/types'
import { SiomaiCountBadge } from '@/components/ui/Badge'

interface SiomaiCardProps {
  siomai: SiomaiType
  animationDelay?: number
}

export function SiomaiCard({ siomai, animationDelay = 0 }: SiomaiCardProps) {
  const isSoldOut = !siomai.is_available || siomai.available_count === 0

  return (
    <article
      className="card card-reveal"
      style={{
        padding: '1.125rem',
        opacity: isSoldOut ? 0.55 : 1,
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <SiomaiCountBadge count={siomai.available_count} isAvailable={siomai.is_available} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-ink-3)',
          backgroundColor: 'var(--color-paper-3)',
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
        }}>
          {siomai.meat_type}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '1.125rem',
        color: 'var(--color-ink)',
        margin: '0.375rem 0 0',
      }}>
        {siomai.name}
      </h3>

      {/* Large count display */}
      <div style={{
        fontFamily: 'var(--font-outlier)',
        fontSize: '2.5rem',
        fontWeight: 500,
        color: isSoldOut ? 'var(--color-ink-3)' : 'var(--color-accent)',
        lineHeight: 1,
        marginTop: '0.5rem',
      }}>
        {isSoldOut ? '—' : siomai.available_count}
        {!isSoldOut && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-ink-3)',
            marginLeft: '0.375rem',
          }}>
            pcs
          </span>
        )}
      </div>
    </article>
  )
}
