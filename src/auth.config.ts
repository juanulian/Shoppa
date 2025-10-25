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
        if (!isLoggedIn) return false

        // Check if user is admin
        const userRole = auth.user?.role
        if (userRole !== 'ADMIN') return false

        return true
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
