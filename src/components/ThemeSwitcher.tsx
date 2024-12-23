'use client'

import { themes, useTheme } from '@/contexts/ThemeContext'
import { useState, useRef, useEffect } from 'react'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const themeOptions = [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'blue', name: 'Blue' },
    { id: 'purple', name: 'Purple' },
  ] as const

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-button flex items-center gap-1 border border-[var(--border)]"
      >
        <span className="h-4 w-4 rounded-full border border-[var(--border)]" 
          style={{ background: themes[theme].primary }} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setTheme(option.id)
                setIsOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--border)] ${
                theme === option.id ? 'bg-[var(--border)]' : ''
              }`}
            >
              <span
                className="h-4 w-4 rounded-full border border-[var(--border)]"
                style={{ background: themes[option.id].primary }}
              />
              <span className="text-[var(--text)]">{option.name}</span>
              {theme === option.id && (
                <svg
                  className="ml-auto h-4 w-4 text-[var(--primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 