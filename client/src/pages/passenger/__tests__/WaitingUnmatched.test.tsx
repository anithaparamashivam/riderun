import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import WaitingForProvider from '../WaitingForProvider';

// Mock socket.io-client
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  disconnect: vi.fn(),
};
vi.mock('socket.io-client', () => ({ default: vi.fn(() => mockSocket), io: vi.fn(() => mockSocket) }));

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1', role: 'passenger' }, loading: false, logout: vi.fn(), updateRole: vi.fn() }),
}));

function renderWaiting() {
  return render(
    <MemoryRouter initialEntries={['/passenger/waiting/req123']}>
      <Routes>
        <Route path="/passenger/waiting/:requestId" element={<WaitingForProvider />} />
        <Route path="/passenger" element={<div>Passenger Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('WaitingForProvider — socket events', () => {
  beforeEach(() => {
    mockSocket.on.mockReset();
    mockSocket.off.mockReset();
    mockSocket.disconnect.mockReset();
  });

  it('shows unmatched message when request:unmatched is received (AC5)', () => {
    renderWaiting();

    // Simulate socket emitting request:unmatched
    const unmatchedHandler = mockSocket.on.mock.calls.find(c => c[0] === 'request:unmatched')?.[1];
    act(() => { unmatchedHandler?.({ requestId: 'req123' }); });

    expect(screen.getByText(/no providers available right now/i)).toBeInTheDocument();
  });

  it('shows "Try again" button in unmatched state (AC5)', () => {
    renderWaiting();

    const unmatchedHandler = mockSocket.on.mock.calls.find(c => c[0] === 'request:unmatched')?.[1];
    act(() => { unmatchedHandler?.({ requestId: 'req123' }); });

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('"Try again" navigates to passenger home (AC5)', async () => {
    renderWaiting();

    const unmatchedHandler = mockSocket.on.mock.calls.find(c => c[0] === 'request:unmatched')?.[1];
    act(() => { unmatchedHandler?.({ requestId: 'req123' }); });

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByText('Passenger Home')).toBeInTheDocument();
  });
});
