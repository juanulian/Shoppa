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

      console.log('[MW-V3] ===== AUTH CHECK V3 =====')
      console.log('[MW-V3] Path:', nextUrl.pathname)
      console.log('[MW-V3] Logged in:', isLoggedIn)
      console.log('[MW-V3] User:', JSON.stringify(auth?.user))
      console.log('[MW-V3] Auth keys:', auth ? Object.keys(auth) : 'null')

      if (isOnAdminPanel) {
        if (!isLoggedIn) {
          console.log('[MW-V3] ❌ Not logged in')
          return false
        }

        const userRole = auth.user?.role
        console.log('[MW-V3] Role:', userRole)

        if (userRole !== 'ADMIN') {
          console.log('[MW-V3] ❌ Not admin')
          return false
        }

        console.log('[MW-V3] ✅ Admin OK')
        return true
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
