'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { IconType } from 'react-icons'
import { useSidebar } from '@/contexts/SidebarContext'
import { HiOutlineUsers, HiOutlineHome } from 'react-icons/hi'

interface NavItem {
  name: string
  href: string
  icon: IconType
}

const navItems: NavItem[] = [
  { name: 'Overview', href: '/dashboard/overview', icon: HiOutlineHome },
  { name: 'Users', href: '/dashboard/users', icon: HiOutlineUsers }
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (pathname !== undefined) {
      close()
    }
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 transform border-r border-[var(--border)] bg-[var(--surface)] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--text)] hover:bg-[var(--border)]'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
} 