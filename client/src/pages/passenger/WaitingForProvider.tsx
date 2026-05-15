import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../../lib/api';

type State = 'waiting' | 'assigned' | 'unmatched';

export default function WaitingForProvider() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<State>('waiting');

  useEffect(() => {
    const socket = SERVER_URL
      ? io(SERVER_URL, { withCredentials: true, transports: ['websocket'] })
      : io({ withCredentials: true, transports: ['websocket'] });

    socket.on('request:assigned', ({ requestId: id }: { requestId: string }) => {
      if (id === requestId) {
        setState('assigned');
        navigate(`/passenger/tracking/${id}`);
      }
    });

    socket.on('request:unmatched', ({ requestId: id }: { requestId: string }) => {
      if (id === requestId) {
        setState('unmatched');
      }
    });

    return () => {
      socket.off('request:assigned');
      socket.off('request:unmatched');
      socket.disconnect();
    };
  }, [requestId, navigate]);

  if (state === 'unmatched') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-[var(--color-destructive)]/30 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm">
          <p className="mb-2 text-lg font-semibold text-[var(--color-destructive)]">No providers available</p>
          <p className="mb-6 text-sm text-zinc-500">
            No providers available right now. Please try again.
          </p>
          <button
            type="button"
            onClick={() => navigate('/passenger')}
            className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-col items-center gap-6 text-center"
      >
        <div
          className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]"
          role="status"
          aria-label="Loading"
        />
        <h1 className="text-xl font-semibold text-[var(--color-foreground)]">
          Looking for a provider…
        </h1>
        <p className="text-sm text-zinc-500">
          We're finding someone nearby. This usually takes under a minute.
        </p>
      </div>
    </main>
  );
}
