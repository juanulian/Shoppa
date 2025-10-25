import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin')

      console.log('[MIDDLEWARE] Checking auth for:', nextUrl.pathname)
      console.log('[MIDDLEWARE] isLoggedIn:', isLoggedIn)
      console.log('[MIDDLEWARE] Auth object:', JSON.stringify(auth))

      if (isOnAdminPanel) {
        if (!isLoggedIn) {
          console.log('[MIDDLEWARE] Not logged in, redirecting to login')
          return false
        }

        // In middleware with JWT strategy, we need to check the role from the token
        // @ts-ignore - token exists but TS doesn't know about it
        const userRole = auth.user?.role || auth?.token?.role
        console.log('[MIDDLEWARE] User role:', userRole)

        if (userRole !== 'ADMIN') {
          console.log('[MIDDLEWARE] Not admin, role:', userRole)
          return false
        }

        console.log('[MIDDLEWARE] Admin access granted')
        return true
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
