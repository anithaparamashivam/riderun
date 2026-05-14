import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Role = 'passenger' | 'provider';

interface RoleOption {
  id: Role;
  label: string;
  description: string;
  icon: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'passenger',
    label: 'Passenger',
    description: 'Book rides and errands whenever you need them.',
    icon: '🧍',
  },
  {
    id: 'provider',
    label: 'Service Provider',
    description: 'Accept ride and errand requests and earn money.',
    icon: '🚗',
  },
];

export default function RoleSelection() {
  const { updateRole } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateRole(selected);
      navigate(selected === 'passenger' ? '/passenger' : '/provider');
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Choose your role</h1>
          <p className="mt-1 text-sm text-zinc-500">You can only set this once.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ROLES.map(role => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelected(role.id)}
              className={[
                'flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]',
                selected === role.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-accent)]'
                  : 'border-[var(--color-border)] bg-white dark:bg-zinc-900 hover:border-zinc-400',
              ].join(' ')}
              aria-pressed={selected === role.id}
            >
              <span className="text-4xl" aria-hidden="true">{role.icon}</span>
              <span className="font-semibold text-[var(--color-foreground)]">{role.label}</span>
              <span className="text-xs text-zinc-500">{role.description}</span>
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-[var(--color-destructive)]">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={!selected || submitting}
          onClick={handleConfirm}
          className="mt-6 w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          {submitting ? 'Saving…' : 'Confirm'}
        </button>
      </div>
    </main>
  );
}
