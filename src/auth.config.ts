import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin')

      if (isOnAdminPanel) {
        if (!isLoggedIn) return false
        // Check if user is admin
        if (auth.user.role !== 'ADMIN') {
          return Response.redirect(new URL('/', nextUrl))
        }
        return true
      }

      return true
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig
