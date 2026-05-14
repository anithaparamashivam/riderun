import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GoogleMap: ({ children }: { children?: React.ReactNode }) => <div role="application" aria-label="Provider tracking map">{children}</div>,
  Marker: () => <div data-testid="provider-marker" />,
}));

let mockSocketEmit: ReturnType<typeof vi.fn>;
let mockSocketDisconnect: ReturnType<typeof vi.fn>;
const eventHandlers: Record<string, (data: unknown) => void> = {};

vi.mock('socket.io-client', () => ({
  io: () => ({
    on: (event: string, handler: (data: unknown) => void) => { eventHandlers[event] = handler; },
    off: vi.fn(),
    emit: (...args: unknown[]) => mockSocketEmit(...args),
    disconnect: () => mockSocketDisconnect(),
    connected: true,
  }),
}));

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: { watchPosition: vi.fn(() => 1), clearWatch: vi.fn(), getCurrentPosition: vi.fn() },
  configurable: true,
});

import ActiveRequest from '../ActiveRequest';

function renderActiveRequest(requestId = 'req-test') {
  return render(
    <MemoryRouter initialEntries={[`/provider/active/${requestId}`]}>
      <Routes>
        <Route path="/provider/active/:requestId" element={<ActiveRequest requestId={requestId} />} />
        <Route path="/provider/complete" element={<div>Provider Complete</div>} />
        <Route path="/provider" element={<div>Provider Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockSocketEmit = vi.fn();
  mockSocketDisconnect = vi.fn();
  for (const key of Object.keys(eventHandlers)) delete eventHandlers[key];
});

describe('ActiveRequest', () => {
  it('renders Mark Complete button (AC6)', () => {
    renderActiveRequest();
    expect(screen.getByRole('button', { name: /mark complete/i })).toBeInTheDocument();
  });

  it('emits request:completed when Mark Complete is clicked (AC1)', async () => {
    renderActiveRequest('req-123');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /mark complete/i }));
    });
    expect(mockSocketEmit).toHaveBeenCalledWith('request:completed', { requestId: 'req-123' });
  });

  it('disables button while completing (AC6)', async () => {
    const onComplete = vi.fn();
    render(
      <MemoryRouter>
        <ActiveRequest requestId="req-123" onComplete={onComplete} />
      </MemoryRouter>
    );
    const btn = screen.getByRole('button', { name: /mark complete/i });
    await act(async () => { fireEvent.click(btn); });
    expect(btn).toBeDisabled();
  });
});
