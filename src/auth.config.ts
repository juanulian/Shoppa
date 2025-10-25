import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin')

      if (isOnAdminPanel) {
        // In NextAuth v5 with JWT, auth is the decoded JWT token
        const isLoggedIn = !!auth

        if (!isLoggedIn) {
          console.log('[MW-V4] Not logged in')
          return false
        }

        // Access role directly from auth (which IS the token in middleware)
        // @ts-ignore - NextAuth v5 middleware auth structure
        const userRole = auth.role || auth.user?.role

        console.log('[MW-V4] Full auth:', JSON.stringify(auth))
        console.log('[MW-V4] Role found:', userRole)

        if (userRole !== 'ADMIN') {
          console.log('[MW-V4] ❌ Access denied, role:', userRole)
          return false
        }

        console.log('[MW-V4] ✅ Admin OK')
        return true
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
