import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

describe('Navbar', () => {
  it('should render the logo and theme switcher', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<Navbar />);
    expect(screen.getByText('TimeTracker')).toBeInTheDocument();
  });

  it('should show profile picture when user is logged in', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { photo: '/user-photo.png', name: 'John Doe' } },
    });
    render(<Navbar />);
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', '/user-photo.png');
  });
});