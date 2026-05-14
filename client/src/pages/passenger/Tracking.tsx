import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import TrackingMap from '../../components/TrackingMap';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

export default function Tracking() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const socket = io({ withCredentials: true, transports: ['websocket'] });

    socket.on('location:update', ({ lat, lng }: { lat: number; lng: number }) => {
      setPosition({ lat, lng });
    });

    socket.on('request:completed', ({ requestId: id }: { requestId: string }) => {
      if (id === requestId) navigate(`/passenger/complete/${id}`);
    });

    return () => {
      socket.off('location:update');
      socket.off('request:completed');
      socket.disconnect();
    };
  }, [requestId, navigate]);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <TrackingMap position={position} apiKey={MAPS_API_KEY} />

      <div className="fixed bottom-0 left-0 right-0 z-10 rounded-t-2xl bg-white dark:bg-zinc-900 px-6 py-5 shadow-lg">
        <p className="text-xs text-zinc-400 mb-1">Tracking request</p>
        <p className="font-mono text-sm font-semibold text-[var(--color-foreground)]">{requestId}</p>
        <p className="mt-1 text-xs text-zinc-500">Your provider is on the way</p>
      </div>
    </main>
  );
}
