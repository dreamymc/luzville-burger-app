import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { email, password, token } = await request.json()

  const setupToken = process.env.OWNER_SETUP_TOKEN
  if (!setupToken || token !== setupToken) {
    return NextResponse.json({ error: 'Invalid setup token.' }, { status: 403 })
  }

  const adminSupabase = await createAdminClient()

  // Double-check no users exist
  const { data: existing } = await adminSupabase.auth.admin.listUsers()
  if (existing && existing.users.length > 0) {
    return NextResponse.json({ error: 'An owner account already exists.' }, { status: 409 })
  }

  const { error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
