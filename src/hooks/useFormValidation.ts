import { useState } from 'react'

interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  match?: string
  customError?: string
}

interface FieldRules {
  [key: string]: ValidationRules
}

interface ValidationErrors {
  [key: string]: string
}

export function useFormValidation(rules: FieldRules) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const validateField = (name: string, value: string, form?: HTMLFormElement): string => {
    const fieldRules = rules[name]
    if (!fieldRules) return ''

    // Trim the value for validation
    const trimmedValue = value.trim()

    if (fieldRules.required && !trimmedValue) {
      return fieldRules.customError || `${name} is required`
    }

    // Only validate non-empty values for other rules
    if (trimmedValue) {
      if (fieldRules.minLength && trimmedValue.length < fieldRules.minLength) {
        return `${name} must be at least ${fieldRules.minLength} characters`
      }

      if (fieldRules.maxLength && trimmedValue.length > fieldRules.maxLength) {
        return `${name} must be less than ${fieldRules.maxLength} characters`
      }

      if (fieldRules.pattern && !fieldRules.pattern.test(trimmedValue)) {
        if (name === 'email') {
          return 'Please enter a valid email address'
        }
        if (name === 'password') {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
        return `${name} is invalid`
      }

      if (fieldRules.match && form) {
        const matchValue = form[fieldRules.match].value
        if (trimmedValue !== matchValue) {
          return 'Passwords do not match'
        }
      }
    }

    return ''
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, form } = e.target
    setTouchedFields(prev => new Set(prev).add(name))
    
    const error = validateField(name, value, form || undefined)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const validateForm = (form: HTMLFormElement): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(rules).forEach((fieldName) => {
      const field = form[fieldName]
      if (field) {
        const error = validateField(fieldName, field.value, form)
        if (error) {
          newErrors[fieldName] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    // Mark all fields as touched when form is submitted
    setTouchedFields(new Set(Object.keys(rules)))
    return isValid
  }

  return { 
    errors, 
    validateForm, 
    validateField,
    handleBlur,
    touchedFields: touchedFields
  }
} 