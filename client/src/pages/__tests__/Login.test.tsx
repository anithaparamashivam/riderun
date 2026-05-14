import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../Login';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false, logout: vi.fn() }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login page', () => {
  it('renders the app name', () => {
    renderLogin();
    expect(screen.getByText(/riderun/i)).toBeInTheDocument();
  });

  it('renders a Sign in with Google button/link (AC1)', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('the Google sign-in link points to /api/auth/google (AC1)', () => {
    renderLogin();
    const link = screen.getByRole('link', { name: /sign in with google/i });
    expect(link).toHaveAttribute('href', '/api/auth/google');
  });
});
