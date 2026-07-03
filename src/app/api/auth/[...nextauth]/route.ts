import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getPayload } from 'payload'
import config from '@payload-config'

const handler = NextAuth({
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
          // first time login → create user with default role
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
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
})

export { handler as GET, handler as POST }
