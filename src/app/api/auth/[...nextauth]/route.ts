import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import axios from 'axios'
import { AxiosError } from 'axios'

const handler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          })

          if (res.data && res.data.token) {
            return {
              id: res.data.id,
              email: res.data.email,
              name: res.data.name,
              role: res.data.role,
              token: res.data.token,
              photo: res.data.photo
            }
          }
          return null
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to login')
          }
          throw new Error('Failed to login')
        }
      }
    })
  ],
  pages: {
    signIn: '/', // Specify the custom signin page
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.token = user.token;
        token.photo = user.photo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.token = token.token;
      session.user.photo = token.photo;
      return session;
    }
  }
})

export { handler as GET, handler as POST }
