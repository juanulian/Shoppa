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

      console.log('[MIDDLEWARE] ===== AUTH CHECK =====')
      console.log('[MIDDLEWARE] Checking auth for:', nextUrl.pathname)
      console.log('[MIDDLEWARE] isLoggedIn:', isLoggedIn)
      console.log('[MIDDLEWARE] auth.user:', auth?.user)
      console.log('[MIDDLEWARE] Full auth keys:', auth ? Object.keys(auth) : 'null')

      // @ts-ignore - accessing token for debugging
      if (auth?.token) {
        // @ts-ignore
        console.log('[MIDDLEWARE] auth.token:', auth.token)
      }

      if (isOnAdminPanel) {
        if (!isLoggedIn) {
          console.log('[MIDDLEWARE] Not logged in, redirecting to login')
          return false
        }

        // Check role from user object
        const userRole = auth.user?.role
        console.log('[MIDDLEWARE] User role from auth.user:', userRole)

        if (userRole !== 'ADMIN') {
          console.log('[MIDDLEWARE] ❌ Access denied - role:', userRole)
          return false
        }

        console.log('[MIDDLEWARE] ✅ Admin access granted')
        return true
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
