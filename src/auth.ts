import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('[AUTH] Authorize called for:', credentials?.email)

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          console.log('[AUTH] Credentials validation failed')
          return null
        }

        const { email, password } = parsedCredentials.data

        // Find user
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          console.log('[AUTH] User not found:', email)
          return null
        }

        console.log('[AUTH] User found, checking password...')

        // Verify password
        const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

        if (!passwordsMatch) {
          console.log('[AUTH] Password mismatch')
          return null
        }

        console.log('[AUTH] Password OK, updating last login...')

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        console.log('[AUTH] Returning user with role:', user.role)

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          role: user.role,
        }
      },
    }),
  ],
})
