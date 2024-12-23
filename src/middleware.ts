import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const isAuthPage = req.nextUrl.pathname === '/'
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard')

    // Allow public pages
    if (!isAuthPage && !isProtectedRoute) {
      return NextResponse.next()
    }

    // Redirect authenticated users from login page to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard/users', req.url))
    }

    // Redirect unauthenticated users to login page
    if (isProtectedRoute && !isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true // We handle the auth logic in middleware
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*'
  ]
}