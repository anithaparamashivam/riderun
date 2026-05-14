import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import RideRequest from '../RideRequest';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1', role: 'passenger' }, loading: false, logout: vi.fn(), updateRole: vi.fn() }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/passenger/ride']}>
      <Routes>
        <Route path="/passenger/ride" element={<RideRequest />} />
        <Route path="/passenger/waiting/:requestId" element={<div>Waiting Screen</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RideRequest page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { _id: 'req1', type: 'ride', status: 'pending' } });
  });

  it('renders labeled pickup and destination inputs (AC1)', () => {
    renderPage();
    expect(screen.getByLabelText(/pickup/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
  });

  it('renders a request ride submit button', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /request ride/i })).toBeInTheDocument();
  });

  it('shows validation error when submitted without selecting locations (AC2)', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /request ride/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('navigates to waiting screen after successful submission (AC4)', async () => {
    renderPage();
    // Simulate filling the hidden lat/lng inputs (test hook)
    const pickupLat = screen.getByTestId('pickup-lat') as HTMLInputElement;
    const pickupLng = screen.getByTestId('pickup-lng') as HTMLInputElement;
    const destLat   = screen.getByTestId('dest-lat') as HTMLInputElement;
    const destLng   = screen.getByTestId('dest-lng') as HTMLInputElement;
    await userEvent.type(pickupLat, '13.0');
    await userEvent.type(pickupLng, '80.2');
    await userEvent.type(destLat,   '12.9');
    await userEvent.type(destLng,   '80.1');
    await userEvent.click(screen.getByRole('button', { name: /request ride/i }));
    expect(await screen.findByText('Waiting Screen')).toBeInTheDocument();
  });
});
