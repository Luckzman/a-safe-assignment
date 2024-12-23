'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'blue' | 'purple'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const themes = {
  light: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#00b3b3',
    primaryHover: '#009999',
    text: '#171717',
    textSecondary: '#666666',
    border: '#e5e5e5',
    error: '#ef4444',
    success: '#22c55e',
  },
  dark: {
    background: '#1a1a1a',
    surface: '#262626',
    primary: '#00b3b3',
    primaryHover: '#009999',
    text: '#ffffff',
    textSecondary: '#a3a3a3',
    border: '#404040',
    error: '#ef4444',
    success: '#22c55e',
  },
  blue: {
    background: '#f0f9ff',
    surface: '#ffffff',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    text: '#0c4a6e',
    textSecondary: '#64748b',
    border: '#e0f2fe',
    error: '#ef4444',
    success: '#22c55e',
  },
  purple: {
    background: '#faf5ff',
    surface: '#ffffff',
    primary: '#9333ea',
    primaryHover: '#7e22ce',
    text: '#581c87',
    textSecondary: '#64748b',
    border: '#f3e8ff',
    error: '#ef4444',
    success: '#22c55e',
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Get saved theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (prefersDark) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    // Apply theme variables to root element
    const root = document.documentElement
    const themeColors = themes[theme]

    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 