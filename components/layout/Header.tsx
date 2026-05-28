import type { ShopStatus } from '@/types'

interface HeaderProps {
  shopStatus: ShopStatus | null
}

export function Header({ shopStatus }: HeaderProps) {
  const isOpen = shopStatus?.is_open ?? false

  return (
    <header style={{
      backgroundColor: 'var(--color-paper)',
      borderBottom: '2px solid var(--color-ink)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: '72rem',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4rem',
        gap: '1rem',
      }}>
        {/* Wordmark — N7 Brutal slab style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
          {/* CSS burger logo */}
          <BurgerLogo />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1rem, 4vw, 1.5rem)',
              color: 'var(--color-ink)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              Luzville
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--color-ink-3)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Burger &amp; More
            </div>
          </div>
        </div>

        {/* Shop Status Badge */}
        <div
          className={`status-badge ${isOpen ? 'status-badge--open' : 'status-badge--closed'}`}
          aria-live="polite"
          aria-label={`Shop is currently ${isOpen ? 'open' : 'closed'}`}
        >
          <span className={`status-dot ${isOpen ? 'status-dot--open' : ''}`} aria-hidden="true" />
          {isOpen ? 'Open' : 'Closed'}
        </div>
      </div>
    </header>
  )
}

function BurgerLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {/* Bun top */}
      <rect x="6" y="7" width="24" height="8" rx="4" fill="oklch(68% 0.170 55)" />
      {/* Sesame seeds */}
      <circle cx="13" cy="10" r="1.2" fill="oklch(80% 0.130 70)" />
      <circle cx="18" cy="9" r="1" fill="oklch(80% 0.130 70)" />
      <circle cx="23" cy="10.5" r="1.1" fill="oklch(80% 0.130 70)" />
      {/* Lettuce */}
      <rect x="5" y="16" width="26" height="3" rx="1" fill="oklch(62% 0.160 145)" />
      {/* Patty */}
      <rect x="6" y="19" width="24" height="5" rx="2" fill="oklch(38% 0.060 45)" />
      {/* Bun bottom */}
      <rect x="6" y="24" width="24" height="5" rx="2.5" fill="oklch(72% 0.155 65)" />
    </svg>
  )
}
