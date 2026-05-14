import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useProviderLocation } from '../useProviderLocation';

function makeSocket(connected = true) {
  return {
    connected,
    emit: vi.fn(),
  } as unknown as import('socket.io-client').Socket;
}

function mockGeolocation(overrides?: Partial<Geolocation>) {
  const watchPosition = vi.fn((success: PositionCallback) => {
    success({
      coords: { latitude: 13.05, longitude: 80.15, accuracy: 10 } as GeolocationCoordinates,
      timestamp: Date.now(),
    } as GeolocationPosition);
    return 1;
  });
  const clearWatch = vi.fn();
  const geo = { watchPosition, clearWatch, getCurrentPosition: vi.fn(), ...overrides };
  Object.defineProperty(navigator, 'geolocation', { value: geo, configurable: true });
  return geo;
}

describe('useProviderLocation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits location:update at 5s intervals (AC2)', () => {
    const geo = mockGeolocation();
    const socket = makeSocket();

    renderHook(() =>
      useProviderLocation({ requestId: 'req-1', socket, active: true })
    );

    // No emit yet — interval hasn't fired
    expect(socket.emit).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(5000); });
    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('location:update', {
      requestId: 'req-1',
      lat: 13.05,
      lng: 80.15,
    });

    act(() => { vi.advanceTimersByTime(5000); });
    expect(socket.emit).toHaveBeenCalledTimes(2);

    geo.clearWatch(1); // suppress lint
  });

  it('stops emitting on unmount (AC5/AC6)', () => {
    mockGeolocation();
    const socket = makeSocket();

    const { unmount } = renderHook(() =>
      useProviderLocation({ requestId: 'req-2', socket, active: true })
    );

    act(() => { vi.advanceTimersByTime(5000); });
    expect(socket.emit).toHaveBeenCalledTimes(1);

    unmount();

    act(() => { vi.advanceTimersByTime(10000); });
    // No additional emits after unmount
    expect(socket.emit).toHaveBeenCalledTimes(1);
  });

  it('returns denied status when geolocation is refused (AC4)', () => {
    const watchPosition = vi.fn((_success: PositionCallback, error: PositionErrorCallback) => {
      error({ code: 1, message: 'denied' } as GeolocationPositionError);
      return 2;
    });
    Object.defineProperty(navigator, 'geolocation', {
      value: { watchPosition, clearWatch: vi.fn(), getCurrentPosition: vi.fn() },
      configurable: true,
    });
    const socket = makeSocket();

    const { result } = renderHook(() =>
      useProviderLocation({ requestId: 'req-3', socket, active: true })
    );

    expect(result.current).toBe('denied');
  });

  it('does not start watching when active=false', () => {
    const geo = mockGeolocation();
    const socket = makeSocket();

    renderHook(() =>
      useProviderLocation({ requestId: 'req-4', socket, active: false })
    );

    expect(geo.watchPosition).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(10000); });
    expect(socket.emit).not.toHaveBeenCalled();
  });
});
