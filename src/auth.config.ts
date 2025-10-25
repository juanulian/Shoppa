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
      console.log('[MIDDLEWARE] User:', auth?.user)

      if (isOnAdminPanel) {
        if (!isLoggedIn) {
          console.log('[MIDDLEWARE] Not logged in, redirecting to login')
          return false
        }

        if (auth.user?.role !== 'ADMIN') {
          console.log('[MIDDLEWARE] Not admin, role:', auth.user?.role)
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
