import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  GoogleMap: ({ children, center, ...rest }: { children?: React.ReactNode; center?: { lat: number; lng: number }; [key: string]: unknown }) => (
    <div
      data-testid="google-map"
      data-lat={center?.lat}
      data-lng={center?.lng}
      role={rest['aria-label'] ? 'application' : undefined}
      aria-label={rest['aria-label'] as string | undefined}
    >
      {children}
    </div>
  ),
  Marker: ({ position, icon }: { position?: { lat: number; lng: number }; icon?: unknown }) => (
    <div
      data-testid="provider-marker"
      data-lat={position?.lat}
      data-lng={position?.lng}
      data-icon={JSON.stringify(icon)}
    />
  ),
}));

import TrackingMap from '../TrackingMap';

describe('TrackingMap', () => {
  it('shows loading overlay when position is null (AC4)', () => {
    render(<TrackingMap position={null} apiKey="test-key" />);
    expect(screen.getByText(/waiting for provider/i)).toBeInTheDocument();
  });

  it('renders map container with role=application and aria-label (AC2)', () => {
    render(<TrackingMap position={{ lat: 13.05, lng: 80.15 }} apiKey="test-key" />);
    expect(screen.getByRole('application')).toBeInTheDocument();
    expect(screen.getByRole('application')).toHaveAttribute('aria-label', 'Provider tracking map');
  });

  it('renders marker at given position (AC3)', () => {
    render(<TrackingMap position={{ lat: 13.05, lng: 80.15 }} apiKey="test-key" />);
    const marker = screen.getByTestId('provider-marker');
    expect(marker).toHaveAttribute('data-lat', '13.05');
    expect(marker).toHaveAttribute('data-lng', '80.15');
  });

  it('updates marker when position prop changes (AC3)', () => {
    const { rerender } = render(<TrackingMap position={{ lat: 13.05, lng: 80.15 }} apiKey="test-key" />);
    rerender(<TrackingMap position={{ lat: 13.1, lng: 80.2 }} apiKey="test-key" />);
    const marker = screen.getByTestId('provider-marker');
    expect(marker).toHaveAttribute('data-lat', '13.1');
    expect(marker).toHaveAttribute('data-lng', '80.2');
  });

  it('hides loading overlay once position is received (AC4)', () => {
    const { rerender } = render(<TrackingMap position={null} apiKey="test-key" />);
    expect(screen.getByText(/waiting for provider/i)).toBeInTheDocument();
    rerender(<TrackingMap position={{ lat: 13.05, lng: 80.15 }} apiKey="test-key" />);
    expect(screen.queryByText(/waiting for provider/i)).not.toBeInTheDocument();
  });
});
