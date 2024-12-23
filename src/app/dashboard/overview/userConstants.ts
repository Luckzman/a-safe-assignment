import { HiOutlineUsers, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';

export const statsCards = [
  {
    title: 'Total Users',
    icon: HiOutlineUsers,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Active Users',
    icon: HiOutlineCheckCircle,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Inactive Users',
    icon: HiOutlineXCircle,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Pending Users',
    icon: HiOutlineClock,
    color: 'bg-yellow-100 text-yellow-600'
  }
];

export const getChartData = (counts: { activeCount: number; inactiveCount: number; pendingCount: number }) => ({
  labels: ['Active', 'Inactive', 'Pending'],
  datasets: [
    {
      data: [counts.activeCount, counts.inactiveCount, counts.pendingCount],
      backgroundColor: [
        'rgba(34, 197, 94, 0.2)',  // green
        'rgba(239, 68, 68, 0.2)',  // red
        'rgba(234, 179, 8, 0.2)',  // yellow
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)',
        'rgb(234, 179, 8)',
      ],
      borderWidth: 1,
    },
  ],
}); 