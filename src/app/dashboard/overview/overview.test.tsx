import { render, screen, waitFor } from '@testing-library/react';
import OverviewPage from './page';
import { useSession } from 'next-auth/react';
import { getUsers } from '@/app/api/users';

jest.mock('next-auth/react');
jest.mock('@/app/api/users');

describe('OverviewPage', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { token: 'test-token' } } });
  });

  it('should display loading initially', () => {
    (getUsers as jest.Mock).mockResolvedValueOnce(new Promise(() => {})); // Simulate pending promise
    render(<OverviewPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display user statistics after loading', async () => {
    (getUsers as jest.Mock).mockResolvedValueOnce({
      pagination: { total: 100 },
      counts: { totalCount: 100, activeCount: 80, inactiveCount: 15, pendingCount: 5 },
    });

    render(<OverviewPage />);

    await waitFor(() => expect(screen.getByText('Overview')).toBeInTheDocument());
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});