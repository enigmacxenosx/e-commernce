import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/'

  if (code) {
    const supabase = createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      console.log('[enosx] OAuth callback successful for user:', data.user.id)
      
      // Check if user has profile (username exists)
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('id', data.user.id)
        .single()

      // If user doesn't have a profile, redirect to profile setup
      if (!existingUser?.username) {
        console.log('[enosx] Redirecting to profile setup')
        return NextResponse.redirect(new URL('/auth/profile-setup', request.url))
      }

      console.log('[enosx] User has profile, redirecting to:', redirectTo)
      return NextResponse.redirect(new URL(redirectTo, request.url))
    } else {
      console.error('[enosx] OAuth callback error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url))
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
}
