import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

interface UseProviderLocationOptions {
  requestId: string;
  socket: Socket | null;
  active?: boolean;
}

export type LocationStatus = 'idle' | 'watching' | 'denied' | 'unavailable';

export function useProviderLocation({ requestId, socket, active = true }: UseProviderLocationOptions): LocationStatus {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const positionRef = useRef<GeolocationPosition | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active || !socket) return;

    if (!navigator.geolocation) {
      setStatus('unavailable');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        positionRef.current = pos;
        setStatus('watching');
      },
      () => {
        setStatus('denied');
      },
      { enableHighAccuracy: true }
    );

    intervalRef.current = setInterval(() => {
      const pos = positionRef.current;
      if (pos && socket.connected) {
        socket.emit('location:update', {
          requestId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      }
    }, 5000);

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      positionRef.current = null;
    };
  }, [requestId, socket, active]);

  return status;
}
