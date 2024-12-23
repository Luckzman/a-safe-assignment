'use client'

import Image from 'next/image'
import { 
  HiOutlinePencil, 
  HiOutlineKey, 
  HiOutlineTrash, 
  HiDotsVertical,
  HiOutlineSearch,
  HiOutlineUpload,
  HiOutlineDownload,
  HiOutlineFilter,
  HiOutlineUserAdd
} from 'react-icons/hi'
import { useEffect, useState } from 'react';
import { getUsers } from '@/app/api/users';
import { useSession } from 'next-auth/react';
import PaginationControls from '@/components/PaginationControls';

interface User {
  id: number
  photo: string
  firstName: string
  lastName: string
  mobile: string
  email: string
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE'
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FilterParams {
  search?: string;
  status?: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export default function UsersPage() {
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState({
    activeCount: 0,
    pendingCount: 0,
    inactiveCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortConfig, setSortConfig] = useState({ field: '', order: 'asc' });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchUsers = async (page: number, params: FilterParams = {}) => {
    if (session?.user?.token) {
      try {
        setLoading(true);
        const data = await getUsers(session.user.token, { 
          page, 
          limit: pagination.limit,
          ...params
        });
        console.log(data, 'data');   
        setCount(data.counts);
        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const params: FilterParams = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedStatus) params.status = selectedStatus as 'ACTIVE' | 'PENDING' | 'INACTIVE';
    if (sortConfig.field) {
      params.sortBy = sortConfig.field;
      params.sortOrder = sortConfig.order;
    }
    
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(pagination.page, params);
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedStatus, sortConfig]);

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-error">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">Members</h1>
          <div className="mt-1 flex flex-col gap-1 text-sm text-[var(--textSecondary)] lg:flex-row lg:items-center lg:gap-2">
            <span className="whitespace-nowrap">Total members: {pagination.total}</span>
            <span className="hidden lg:block">•</span>
            <span className="whitespace-nowrap">Active users: {count.activeCount}</span>
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="dashboard-button-primary flex items-center gap-2">
            <HiOutlineUserAdd className="h-5 w-5" />
            Add new
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--textSecondary)]" />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 w-[150px] rounded-md border border-[var(--border)] bg-[var(--background)] pl-9 pr-4 text-sm text-[var(--text)] placeholder-[var(--textSecondary)] focus:border-[var(--primary)] focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="relative lg:hidden">
          <button 
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="dashboard-button-secondary flex items-center gap-2"
          >
            Actions
            <HiDotsVertical className="h-4 w-4" />
          </button>

          {isActionsOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg">
              <button 
                onClick={() => setIsActionsOpen(false)}
                className="flex w-full items-center px-4 py-2 text-sm text-[var(--text)] hover:bg-[var(--border)]"
              >
                Add new
              </button>
              <div className="relative mt-2">
                    <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                    />
                    <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--textSecondary)]" />
                </div>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] pl-3 pr-4 mt-2 text-sm text-[var(--text)] placeholder-[var(--textSecondary)] focus:border-[var(--primary)] focus:outline-none"
                >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--textSecondary)]">Photo</th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-[var(--textSecondary)] cursor-pointer"
                  onClick={() => handleSort('firstName')}
                >
                  Member name
                  <span className="ml-1">{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--textSecondary)]">Mobile</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--textSecondary)]">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--textSecondary)]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--textSecondary)]">Operation</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <Image
                      src={user.photo}
                      alt={user.firstName + ' ' + user.lastName}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text)]">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text)]">{user.mobile}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text)]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : user.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-1 text-[var(--textSecondary)] hover:bg-[var(--border)]">
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-[var(--textSecondary)] hover:bg-[var(--border)]">
                        <HiOutlineKey className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-[var(--textSecondary)] hover:bg-[var(--border)]">
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="border-b border-[var(--border)] p-4 last:border-0"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={user.photo}
                  alt={user.firstName + ' ' + user.lastName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="font-medium text-[var(--text)]">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-[var(--textSecondary)]">{user.email}</p>
                  <div className="text-sm text-[var(--textSecondary)]">
                    {user.mobile}
                  </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : user.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                        >
                        {user.status.toLowerCase()}
                        </span>
                        <div className="flex items-center gap-2">
                        <button className="rounded p-2 text-[var(--textSecondary)] hover:bg-[var(--border)]">
                            <HiOutlinePencil className="h-4 w-4" />
                        </button>
                        <button className="rounded p-2 text-[var(--textSecondary)] hover:bg-[var(--border)]">
                            <HiOutlineKey className="h-4 w-4" />
                        </button>
                        <button className="rounded p-2 text-[var(--textSecondary)] hover:bg-[var(--border)]">
                            <HiOutlineTrash className="h-4 w-4" />
                        </button>
                        </div>
                    </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onLimitChange={(newLimit) => {
            setPagination(prev => ({ ...prev, limit: newLimit }));
            fetchUsers(1, { limit: newLimit });
          }}
        />
      </div>
    </div>
  )
} 