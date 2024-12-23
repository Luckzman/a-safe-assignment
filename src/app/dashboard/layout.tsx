'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/contexts/SidebarContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[var(--background)]">
        <Navbar />
        <Sidebar />
        <main className="lg:ml-64 mt-14 p-4">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </SidebarProvider>
  )
}