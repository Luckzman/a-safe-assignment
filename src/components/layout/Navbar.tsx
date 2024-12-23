'use client'

import Link from 'next/link'
import Image from 'next/image'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useState, useRef, useEffect } from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import { HiOutlineMenu } from 'react-icons/hi'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toggle } = useSidebar()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false 
      })
      router.replace('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          {session && (
            <button onClick={toggle} className="md:hidden">
              <HiOutlineMenu className="h-5 w-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-[var(--text)]">
              TimeTracker
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {/* Notifications and Profile - Only for authenticated users */}
          {session && (
            <>
              <button className="nav-button relative">
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--primary)]" />
                <svg
                  className="nav-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <div className="relative" ref={profileDropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 rounded-full hover:bg-[var(--border)] p-1 transition-colors"
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full border border-[var(--border)]">
                    <Image
                      src={session.user.photo || '/placeholder-avatar.png'}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden flex-col text-left text-sm md:flex">
                    <span className="font-medium text-[var(--text)]">{session.user.name}</span>
                    {session.user.role === 'ADMIN' && <span className="text-xs text-[var(--textSecondary)]">{session.user.role.toLowerCase()}</span>}
                  </div>
                  <svg
                    className={`hidden h-4 w-4 text-[var(--textSecondary)] transition-transform md:block ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
                    <div className="border-b border-[var(--border)] px-4 py-2 md:hidden">
                      <p className="font-medium text-[var(--text)]">Luke Asote</p>
                      <p className="text-xs text-[var(--textSecondary)]">Admin</p>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--border)]"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </button>

                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--border)]"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                    </div>

                    <div className="border-t border-[var(--border)] py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[var(--border)]"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 