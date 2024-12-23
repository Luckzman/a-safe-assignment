'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useFormValidation } from '@/hooks/useFormValidation'
// import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { errors, validateForm, handleBlur, touchedFields } = useFormValidation({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Something went wrong')
      }

      setSuccess('Password reset instructions have been sent to your email')
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send reset email')
      setSuccess(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* <ThemeSwitcher /> */}
      <div className="form-container shadow">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <h1 className="text-xl font-medium">Reset Password</h1>
          <p className="text-[var(--textSecondary)] text-sm">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

          {error && (
            <div className="text-error text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="text-success text-sm">
              {success}
            </div>
          )}

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

          <button type="submit" className="btn-primary">
            Send Reset Link
          </button>

          <div className="flex items-center justify-center text-xs">
            <span className="text-[var(--textSecondary)]">
              Remember your password? <Link href="/" className="text-[var(--text)] hover:underline">Log in</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
} 