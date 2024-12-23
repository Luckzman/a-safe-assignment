import { render, screen, waitFor } from '@testing-library/react';
import UsersPage from './page';
import { useSession } from 'next-auth/react';
import { getUsers } from '@/app/api/users';

jest.mock('next-auth/react');
jest.mock('@/app/api/users');

describe('UsersPage', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { token: 'test-token' } } });
  });

  it('should display loading initially', () => {
    (getUsers as jest.Mock).mockResolvedValueOnce(new Promise(() => {})); // Simulate pending promise
    render(<UsersPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display users after loading', async () => {
    (getUsers as jest.Mock).mockResolvedValueOnce({
      users: [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', mobile: '1234567890', status: 'ACTIVE', photo: '/placeholder-avatar.png' }],
      counts: { activeCount: 1, pendingCount: 0, inactiveCount: 0 },
      pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });

    render(<UsersPage />);

    await waitFor(() => expect(screen.getByText('Members')).toBeInTheDocument());
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});