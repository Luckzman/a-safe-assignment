'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getUsers } from '@/app/api/users'
import { statsCards, getChartData } from './userConstants'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface UserCounts {
  totalCount: number
  activeCount: number
  inactiveCount: number
  pendingCount: number
}

// Define a type for the keys of UserCounts
type UserCountKeys = 'totalCount' | 'activeCount' | 'inactiveCount' | 'pendingCount';

export default function OverviewPage() {
  const { data: session } = useSession()
  const [counts, setCounts] = useState<UserCounts>({
    totalCount: 0,
    activeCount: 0,
    inactiveCount: 0,
    pendingCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.token) {
        try {
          const data = await getUsers(session.user.token, { 
            page: 1, 
            limit: 1 
          })
          setCounts({
            totalCount: data.pagination.total,
            ...data.counts
          })
        } catch (error) {
          console.error('Failed to fetch user statistics:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [session])

  const chartData = getChartData(counts)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold text-[var(--text)]">Overview</h1>
      
      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const key = stat.title.replace('Users', '').toLowerCase().trim() + 'Count' as UserCountKeys;
          return (
            <div 
              key={stat.title} 
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--textSecondary)]">{stat.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                    {counts[key]}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )})
        }
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mx-auto max-w-md">
          <Doughnut data={chartData} />
        </div>
      </div>
    </div>
  )
} 