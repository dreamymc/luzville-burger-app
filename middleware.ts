import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow /owner/login and /owner/setup through without auth check
  if (
    pathname === '/owner/login' ||
    pathname.startsWith('/owner/setup')
  ) {
    return NextResponse.next()
  }

  // Protect all /owner/* routes
  if (pathname.startsWith('/owner')) {
    const { supabaseResponse, user } = await updateSession(request)

    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/owner/login'
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  // For all other routes, still refresh the session
  const { supabaseResponse } = await updateSession(request)
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
