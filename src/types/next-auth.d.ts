import type { DefaultSession, DefaultUser } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      role: string
      token: string
      photo: string | null | undefined
    }
    accessToken: string
  }

  interface User extends DefaultUser {
    id: string
    email: string
    name: string
    role: string
    token: string
    photo: string | null | undefined
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    accessToken: string
  }
} 