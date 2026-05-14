import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GoogleMap: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  Marker: ({ position }: { position?: { lat: number; lng: number } }) => (
    <div data-testid="provider-marker" data-lat={position?.lat} data-lng={position?.lng} />
  ),
}));

let mockSocketOn: ReturnType<typeof vi.fn>;
let mockSocketDisconnect: ReturnType<typeof vi.fn>;
let mockSocketOff: ReturnType<typeof vi.fn>;
const eventHandlers: Record<string, (data: unknown) => void> = {};

vi.mock('socket.io-client', () => ({
  io: () => ({
    on: (event: string, handler: (data: unknown) => void) => {
      eventHandlers[event] = handler;
      mockSocketOn(event, handler);
    },
    off: (...args: unknown[]) => mockSocketOff(...args),
    disconnect: () => mockSocketDisconnect(),
    connected: true,
  }),
}));

import Tracking from '../Tracking';

function renderTracking(requestId = 'req-abc') {
  return render(
    <MemoryRouter initialEntries={[`/passenger/tracking/${requestId}`]}>
      <Routes>
        <Route path="/passenger/tracking/:requestId" element={<Tracking />} />
        <Route path="/passenger" element={<div>Passenger Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockSocketOn = vi.fn();
  mockSocketDisconnect = vi.fn();
  mockSocketOff = vi.fn();
  // clear event handlers
  for (const key of Object.keys(eventHandlers)) delete eventHandlers[key];
});

describe('Tracking page', () => {
  it('shows loading overlay before first location:update (AC4)', () => {
    renderTracking();
    expect(screen.getByText(/waiting for provider/i)).toBeInTheDocument();
  });

  it('renders map with role=application (AC2)', () => {
    renderTracking();
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('updates marker when location:update received (AC3)', async () => {
    renderTracking();
    await act(async () => {
      eventHandlers['location:update']?.({ lat: 13.05, lng: 80.15 });
    });
    const marker = screen.getByTestId('provider-marker');
    expect(marker).toHaveAttribute('data-lat', '13.05');
    expect(marker).toHaveAttribute('data-lng', '80.15');
  });

  it('hides loading overlay after first location:update (AC4)', async () => {
    renderTracking();
    expect(screen.getByText(/waiting for provider/i)).toBeInTheDocument();
    await act(async () => {
      eventHandlers['location:update']?.({ lat: 13.05, lng: 80.15 });
    });
    expect(screen.queryByText(/waiting for provider/i)).not.toBeInTheDocument();
  });

  it('shows request summary card (AC5)', () => {
    renderTracking('req-abc');
    // summary is shown with requestId
    expect(screen.getByText(/req-abc/i)).toBeInTheDocument();
  });
});
