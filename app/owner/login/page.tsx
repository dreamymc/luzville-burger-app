'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OwnerLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Append virtual domain suffix if not a full email format
    const formattedEmail = username.includes('@') 
      ? username 
      : `${username.trim().toLowerCase()}@luzville.local`

    const supabase = createClient() as any
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/owner/dashboard')
      router.refresh()
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--color-paper)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '22rem',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '2rem',
            color: 'var(--color-ink)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}>
            Luzville
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-ink-3)',
            marginTop: '0.25rem',
          }}>
            Owner sign in
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="username" className="label">Username</label>
            <input
              id="username"
              type="text"
              className="input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-accent-2)',
              backgroundColor: 'var(--color-closed-bg)',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              margin: 0,
            }}
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'is-disabled' : ''}`}
            disabled={loading}
            style={{ width: '100%', padding: '0.875rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
                Signing in…
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-ink-3)',
        }}>
          Don&apos;t have an account?{' '}
          <a href="/owner/setup" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
            First-time setup
          </a>
        </p>
      </div>
    </div>
  )
}
