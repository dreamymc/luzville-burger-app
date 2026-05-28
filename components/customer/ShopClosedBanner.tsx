export function ShopClosedBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        backgroundColor: 'var(--color-closed-bg)',
        borderBottom: '2px solid var(--color-closed)',
        padding: '0.875rem 1rem',
        textAlign: 'center',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'clamp(0.9rem, 3vw, 1.125rem)',
        color: 'var(--color-closed)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        🔒 We&apos;re closed right now — come back soon!
      </p>
    </div>
  )
}
