'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PasswordInput from '@/components/auth/PasswordInput'
import { useFormValidation } from '@/hooks/useFormValidation'
// import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { errors, validateForm, handleBlur, touchedFields } = useFormValidation({
    firstName: {
      required: true,
      minLength: 2,
    },
    lastName: {
      required: true,
      minLength: 2,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    },
    confirmPassword: {
      required: true,
      match: 'password',
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    
    if (!validateForm(form)) {
      return
    }

    const formData = new FormData(form)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Something went wrong')
      }

      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to register')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* <ThemeSwitcher /> */}
      <div className="form-container shadow">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <h1 className="text-xl font-medium">Sign Up</h1>

          {error && (
            <div className="text-error text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="Firstname"
                className="form-input"
                onBlur={handleBlur}
              />
              {touchedFields.has('firstName') && errors.firstName && (
                <p className="mt-1 text-xs text-error">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Lastname"
                className="form-input"
                onBlur={handleBlur}
              />
              {touchedFields.has('lastName') && errors.lastName && (
                <p className="mt-1 text-xs text-error">{errors.lastName}</p>
              )}
            </div>

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
              <PasswordInput name="password" placeholder="Password" onBlur={handleBlur} />
              {touchedFields.has('password') && errors.password && (
                <p className="mt-1 text-xs text-error">{errors.password}</p>
              )}
            </div>

            <div>
              <PasswordInput name="confirmPassword" placeholder="Repeat Password" onBlur={handleBlur} />
              {touchedFields.has('confirmPassword') && errors.confirmPassword && (
                <p className="mt-1 text-xs text-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Sign up
          </button>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--textSecondary)]">
              or, <Link href="/" className="text-[var(--text)] hover:underline">log in</Link>
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