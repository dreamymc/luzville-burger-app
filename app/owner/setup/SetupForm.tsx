'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SetupForm({ token }: { token: string }) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    setError('')

    const formattedEmail = username.includes('@') 
      ? username 
      : `${username.trim().toLowerCase()}@luzville.local`

    const res = await fetch('/api/owner/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formattedEmail, password, token }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Setup failed.')
      setLoading(false)
    } else {
      router.push('/owner/login?setup=success')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-ink-2)', margin: 0 }}>
        Create the owner account. After this, remove <code>OWNER_SETUP_TOKEN</code> from your environment variables.
      </p>

      <div>
        <label htmlFor="setup-username" className="label">Username</label>
        <input id="setup-username" type="text" className="input" value={username} onChange={e => setUsername(e.target.value)} required placeholder="e.g. admin" />
      </div>
      <div>
        <label htmlFor="setup-password" className="label">Password</label>
        <input id="setup-password" type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
      </div>
      <div>
        <label htmlFor="setup-confirm" className="label">Confirm Password</label>
        <input id="setup-confirm" type="password" className="input" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      </div>

      {error && (
        <p role="alert" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-accent-2)', backgroundColor: 'var(--color-closed-bg)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', margin: 0 }}>
          {error}
        </p>
      )}

      <button type="submit" className={`btn btn-primary ${loading ? 'is-disabled' : ''}`} disabled={loading} style={{ width: '100%', padding: '0.875rem' }}>
        {loading ? 'Creating account…' : 'Create Owner Account'}
      </button>
    </form>
  )
}
