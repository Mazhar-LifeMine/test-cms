import GoogleProvider from 'next-auth/providers/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
          collection: 'users',
          where: { email: { equals: user.email } },
        })
        if (docs.length === 0) {
          await payload.create({
            collection: 'users',
            data: {
              email: user.email!,
              password: Math.random().toString(36),
              role: 'user',
              allowedSubjects: [],
            },
          })
        }
        return true
      } catch (err) {
        console.error('SignIn error:', err)
        return true
      }
    },
    async jwt({ token }) {
      if (token.email) {
        try {
          const payload = await getPayload({ config })
          const { docs } = await payload.find({
            collection: 'users',
            where: { email: { equals: token.email } },
            depth: 1,
          })
          if (docs[0]) {
            const dbUser = docs[0] as any
            token.role = dbUser.role ?? 'user'
            token.allowedSlugs = (dbUser.allowedSubjects ?? []).map((s: any) =>
              typeof s === 'object' ? s.slug : s,
            )
          }
        } catch (err) {
          console.error('JWT error:', err)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        ;(session.user as any).role = token.role
        ;(session.user as any).allowedSlugs = token.allowedSlugs
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
}

export async function getUserWithAccess() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) return null

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: session.user.email } },
    depth: 1,
  })

  if (!docs[0]) return null

  const user = docs[0] as any

  return {
    email: user.email,
    role: user.role,
    allowedSubjects: user.allowedSubjects ?? [],
    isAdmin: user.role === 'admin',
  }
}

export function hasSubjectAccess(
  user: Awaited<ReturnType<typeof getUserWithAccess>>,
  subjectId: string,
): boolean {
  if (!user) return false
  if (user.isAdmin) return true
  if (user.role === 'blocked') return false

  return user.allowedSubjects.some((s: any) => (typeof s === 'object' ? s.id : s) === subjectId)
}
