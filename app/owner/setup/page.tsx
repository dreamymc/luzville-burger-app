import { notFound, redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { SetupForm } from './SetupForm'

export const dynamic = 'force-dynamic'

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  const setupToken = process.env.OWNER_SETUP_TOKEN

  // If no setup token configured, disable this route
  if (!setupToken) {
    notFound()
  }

  // Validate the token
  if (params.token !== setupToken) {
    notFound()
  }

  // Check if a user already exists — if so, redirect to login
  const adminSupabase = await createAdminClient()
  const { data: users } = await adminSupabase.auth.admin.listUsers()
  if (users && users.users.length > 0) {
    redirect('/owner/login')
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
      <div style={{ width: '100%', maxWidth: '22rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '2rem',
            color: 'var(--color-ink)',
            textTransform: 'uppercase',
          }}>
            Luzville
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-ink-3)',
            marginTop: '0.25rem',
          }}>
            One-time owner setup
          </div>
        </div>
        <SetupForm token={params.token!} />
      </div>
    </div>
  )
}
