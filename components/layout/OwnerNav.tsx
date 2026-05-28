'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/owner/dashboard', label: 'Dashboard', icon: '⚡' },
  { href: '/owner/categories', label: 'Categories', icon: '📂' },
  { href: '/owner/products', label: 'Products', icon: '🍔' },
  { href: '/owner/siomai', label: 'Siomai', icon: '🥟' },
]

export function OwnerNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/owner/login')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="owner-sidebar"
        style={{
          display: 'none',
          width: '14rem',
          flexShrink: 0,
          padding: '1.5rem 0.75rem',
          flexDirection: 'column',
          gap: '0.25rem',
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflowY: 'auto',
        }}
        id="owner-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: '0 0.75rem 1.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.75rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-accent)', letterSpacing: '-0.01em' }}>
            Luzville
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Owner Panel
          </div>
        </div>

        <nav aria-label="Owner navigation">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`owner-nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={handleSignOut} className="owner-nav-link btn" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', cursor: 'pointer', background: 'none', color: 'var(--color-ink-3)' }}>
            <span aria-hidden="true">🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Owner navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: 'var(--color-paper-dark-2)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          padding: '0.25rem',
          gap: '0.125rem',
        }}
        id="owner-bottom-nav"
      >
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.125rem',
              padding: '0.5rem 0.25rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              backgroundColor: pathname === link.href ? 'oklch(68% 0.170 55 / 0.15)' : 'transparent',
              transition: 'background-color 150ms ease-out',
            }}
          >
            <span style={{ fontSize: '1.25rem' }} aria-hidden="true">{link.icon}</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: pathname === link.href ? 'var(--color-accent)' : 'oklch(60% 0.015 70)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {link.label}
            </span>
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.125rem',
            padding: '0.5rem 0.25rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '1.25rem' }} aria-hidden="true">🚪</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 600, color: 'oklch(60% 0.015 70)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Out
          </span>
        </button>
      </nav>

      {/* Responsive style — sidebar on md+ */}
      <style>{`
        @media (min-width: 768px) {
          #owner-sidebar { display: flex !important; }
          #owner-bottom-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
