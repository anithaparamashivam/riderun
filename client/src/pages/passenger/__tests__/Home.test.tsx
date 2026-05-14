import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import PassengerHome from '../Home';

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { userId: 'u1', role: 'passenger' },
    loading: false,
    logout: vi.fn(),
    updateRole: vi.fn(),
  }),
}));

function renderHome(initialPath = '/passenger') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/passenger" element={<PassengerHome />} />
        <Route path="/passenger/ride" element={<div>Ride Form</div>} />
        <Route path="/passenger/errand" element={<div>Errand Form</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PassengerHome', () => {
  it('shows Ride and Errand service cards (AC1)', () => {
    renderHome();
    expect(screen.getByRole('button', { name: /ride/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /errand/i })).toBeInTheDocument();
  });

  it('navigates to /passenger/ride when Ride is clicked (AC2)', async () => {
    renderHome();
    await userEvent.click(screen.getByRole('button', { name: /ride/i }));
    expect(screen.getByText('Ride Form')).toBeInTheDocument();
  });

  it('navigates to /passenger/errand when Errand is clicked (AC3)', async () => {
    renderHome();
    await userEvent.click(screen.getByRole('button', { name: /errand/i }));
    expect(screen.getByText('Errand Form')).toBeInTheDocument();
  });

  it('shows a logout option (AC5)', () => {
    renderHome();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
