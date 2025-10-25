import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // JWT callback - needed for middleware to access token data
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // Session callback - builds session from token
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    // Authorized callback - checks if user can access route
    authorized({ auth, request: { nextUrl } }) {
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin')

      if (isOnAdminPanel) {
        const isLoggedIn = !!auth?.user

        if (!isLoggedIn) {
          console.log('[MW-V5] Not logged in')
          return false
        }

        // Now auth.user should have role from session callback
        const userRole = auth.user?.role

        console.log('[MW-V5] User role:', userRole)

        if (userRole !== 'ADMIN') {
          console.log('[MW-V5] ❌ Not admin, role:', userRole)
          return false
        }

        console.log('[MW-V5] ✅ Admin OK')
        return true
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
