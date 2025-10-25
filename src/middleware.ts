import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

// Middleware v2.1 - force rebuild
export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/admin/:path*'],
}
