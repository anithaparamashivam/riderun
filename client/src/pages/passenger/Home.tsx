import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ServiceCard from '../../components/ServiceCard';

export default function PassengerHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
        <span className="text-xl font-bold text-[var(--color-primary)]">RideRun</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500">{user?.userId}</span>
          <button
            type="button"
            onClick={logout}
            className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 text-2xl font-bold text-[var(--color-foreground)]">
          What do you need today?
        </h1>
        <p className="mb-8 text-sm text-zinc-500">Choose a service to get started.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ServiceCard
            label="Ride"
            description="Book a vehicle to take you anywhere in Chennai."
            icon="🚗"
            onClick={() => navigate('/passenger/ride')}
          />
          <ServiceCard
            label="Errand"
            description="Send someone to a shop to pick up items for you."
            icon="🛍️"
            onClick={() => navigate('/passenger/errand')}
          />
        </div>
      </main>
    </div>
  );
}
