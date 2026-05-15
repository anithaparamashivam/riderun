import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface ProviderProfile {
  name: string;
  isOnline: boolean;
}

export default function ProviderHome() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ProviderProfile>('/api/providers/me')
      .then(res => setProfile(res.data))
      .catch(() => setError('Could not load profile.'));
  }, []);

  async function handleToggle() {
    if (!profile || toggling) return;
    const next = !profile.isOnline;
    setToggling(true);
    setError(null);
    try {
      await api.patch('/api/providers/me/availability', { isOnline: next });
      setProfile(prev => prev ? { ...prev, isOnline: next } : prev);
    } catch {
      setError('Failed to update availability. Please try again.');
    } finally {
      setToggling(false);
    }
  }

  const isOnline = profile?.isOnline ?? false;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
        <span className="text-xl font-black tracking-wide text-[var(--color-primary)]">FRENZZ</span>
        <div className="flex items-center gap-4">
          {profile && <span className="text-sm text-zinc-500">{profile.name}</span>}
          <button
            type="button"
            onClick={logout}
            className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[var(--color-foreground)]">
          {profile ? profile.name : 'Loading…'}
        </h1>

        {/* Status badge */}
        <div className="mb-8 flex justify-center">
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold',
              isOnline
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
            ].join(' ')}
          >
            <span
              className={['h-2 w-2 rounded-full', isOnline ? 'bg-green-500' : 'bg-zinc-400'].join(' ')}
              aria-hidden="true"
            />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Toggle */}
        <button
          type="button"
          aria-label="Toggle availability"
          disabled={!profile || toggling}
          onClick={handleToggle}
          className={[
            'relative inline-flex h-10 w-20 items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
            isOnline ? 'bg-[var(--color-primary)]' : 'bg-zinc-300 dark:bg-zinc-600',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block h-8 w-8 transform rounded-full bg-white shadow transition-transform',
              isOnline ? 'translate-x-11' : 'translate-x-1',
            ].join(' ')}
          />
        </button>

        <p className="mt-4 text-sm text-zinc-500">
          {isOnline ? 'You are receiving requests.' : 'Go online to start receiving requests.'}
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[var(--color-destructive)]">
            {error}
          </p>
        )}
      </main>
    </div>
  );
}
