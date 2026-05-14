import { useEffect, useState } from 'react';

export interface RequestData {
  requestId: string;
  type: 'ride' | 'errand';
  pickupLocation?: { address: string };
  destination?: { address: string };
  shopName?: string;
  itemList?: string;
}

interface Props {
  request: RequestData;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const TIMEOUT_SECONDS = 30;

export default function RequestAlert({ request, onAccept, onDecline }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onDecline(request.requestId);
      return;
    }
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, request.requestId, onDecline]);

  const isRide = request.type === 'ride';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="New service request"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl">
        {/* Type badge */}
        <div className="mb-4 flex items-center justify-between">
          <span
            className={[
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
              isRide
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
            ].join(' ')}
          >
            {isRide ? 'Ride' : 'Errand'}
          </span>
          <span className="text-sm font-medium text-zinc-400">
            {secondsLeft}s
          </span>
        </div>

        {/* Details */}
        <div className="mb-6 space-y-2 text-sm text-[var(--color-foreground)]">
          {isRide ? (
            <>
              <div>
                <span className="font-medium text-zinc-500">Pickup: </span>
                {request.pickupLocation?.address}
              </div>
              <div>
                <span className="font-medium text-zinc-500">To: </span>
                {request.destination?.address}
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-medium text-zinc-500">Shop: </span>
                {request.shopName}
              </div>
              <div>
                <span className="font-medium text-zinc-500">Items: </span>
                {request.itemList}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onDecline(request.requestId)}
            className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-foreground)] hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => onAccept(request.requestId)}
            className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
