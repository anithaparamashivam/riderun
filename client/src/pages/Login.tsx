import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FrenzzLogo from '../components/FrenzzLogo';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'passenger') navigate('/passenger');
      else if (user.role === 'provider') navigate('/provider');
      else navigate('/role-selection');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-white dark:bg-zinc-900 p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <FrenzzLogo size={72} />
          <h1 className="mt-3 text-3xl font-black tracking-wide text-[var(--color-primary)]">FRENZZ</h1>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">Care at Doorstep</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-foreground)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-[var(--color-foreground)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-destructive)]" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
