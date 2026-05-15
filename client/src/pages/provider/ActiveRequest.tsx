import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useProviderLocation } from '../../hooks/useProviderLocation';
import { SERVER_URL } from '../../lib/api';

interface Props {
  requestId: string;
  onComplete?: () => void;
}

export default function ActiveRequest({ requestId, onComplete }: Props) {
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const s = SERVER_URL
      ? io(SERVER_URL, { withCredentials: true, transports: ['websocket'] })
      : io({ withCredentials: true, transports: ['websocket'] });
    socketRef.current = s;
    return () => { s.disconnect(); };
  }, []);

  const locationStatus = useProviderLocation({ requestId, socket: socketRef.current });

  function handleComplete() {
    if (!socketRef.current || completing) return;
    setCompleting(true);
    socketRef.current.emit('request:completed', { requestId });
    if (onComplete) {
      onComplete();
    } else {
      navigate('/provider/complete');
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[var(--color-background)] px-6">
      <h2 className="text-xl font-bold text-[var(--color-foreground)]">Request Accepted</h2>
      <p className="text-sm text-zinc-500">
        Request ID: <span className="font-mono text-xs">{requestId}</span>
      </p>

      {locationStatus === 'denied' || locationStatus === 'unavailable' ? (
        <p className="rounded-lg bg-[var(--color-destructive)] px-4 py-3 text-sm font-medium text-white" role="alert">
          Location access required for tracking. Please enable location permissions and reload.
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleComplete}
        disabled={completing}
        className="w-full max-w-xs rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
      >
        {completing ? 'Completing…' : 'Mark Complete'}
      </button>
    </div>
  );
}
