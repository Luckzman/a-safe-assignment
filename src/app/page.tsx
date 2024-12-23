'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import PasswordInput from '@/components/auth/PasswordInput'
import { useFormValidation } from '@/hooks/useFormValidation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { errors, validateForm, handleBlur, touchedFields } = useFormValidation({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      customError: 'Please enter your email address'
    },
    password: {
      required: true,
      minLength: 6,
      customError: 'Please enter your password'
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (!validateForm(form)) {
      return
    }

    setIsLoading(true)
    const formData = new FormData(form)

    try {
      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })

      if (res?.error) {
        setError(res.error)
      } else if (res?.ok) {
        router.replace('/dashboard/users')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="form-container shadow">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <h1 className="text-xl font-medium">Log in</h1>

          {error && (
            <div className="text-error text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                onBlur={handleBlur}
              />
              {touchedFields.has('email') && errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email}</p>
              )}
            </div>

            <div>
              <PasswordInput 
                name="password" 
                placeholder="Password" 
                onBlur={handleBlur}
              />
              {touchedFields.has('password') && errors.password && (
                <p className="mt-1 text-xs text-error">{errors.password}</p>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary relative w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="opacity-70">Log in</span>
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              'Log in'
            )}
          </button>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--textSecondary)]">
              or, <Link href="/signup" className="text-[var(--text)] hover:underline">sign up</Link>
            </span>
            <Link 
              href="/forgot-password" 
              className="text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
