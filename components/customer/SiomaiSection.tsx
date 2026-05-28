import type { SiomaiType } from '@/types'
import { SiomaiCard } from './SiomaiCard'

interface SiomaiSectionProps {
  siomaiTypes: SiomaiType[]
}

export function SiomaiSection({ siomaiTypes }: SiomaiSectionProps) {
  if (siomaiTypes.length === 0) return null

  return (
    <section aria-label="Siomai" style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          color: 'var(--color-ink)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
        }}>
          Siomai
        </h2>
        <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--color-ink)' }} />
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'var(--color-ink-3)',
        marginBottom: '1rem',
        marginTop: 0,
      }}>
        Counts update live — tell the seller your order at the stall.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 12rem), 1fr))',
        gap: '1rem',
      }}>
        {siomaiTypes.map((siomai, i) => (
          <SiomaiCard key={siomai.id} siomai={siomai} animationDelay={i * 80} />
        ))}
      </div>
    </section>
  )
}
