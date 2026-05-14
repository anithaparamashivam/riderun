import { useNavigate } from 'react-router-dom';

export default function ServiceComplete() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--color-background)] px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
        <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Service Complete</h1>
      <p className="text-sm text-zinc-500 text-center">Great work! The request has been marked as complete.</p>
      <button
        type="button"
        onClick={() => navigate('/provider')}
        className="w-full max-w-xs rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
      >
        Back to Home
      </button>
    </main>
  );
}
