import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationAutocomplete from '../../components/LocationAutocomplete';

interface LocationValue {
  address: string;
  lat: number | null;
  lng: number | null;
}

const EMPTY_LOC: LocationValue = { address: '', lat: null, lng: null };

const CHENNAI = { north: 13.23, south: 12.82, east: 80.34, west: 79.97 };
function inChennai(lat: number, lng: number) {
  return lat >= CHENNAI.south && lat <= CHENNAI.north && lng >= CHENNAI.west && lng <= CHENNAI.east;
}

export default function RideRequest() {
  const navigate = useNavigate();
  const [pickup, setPickup]   = useState<LocationValue>(EMPTY_LOC);
  const [dest, setDest]       = useState<LocationValue>(EMPTY_LOC);
  const [error, setError]     = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (pickup.lat === null || pickup.lng === null) {
      setError('Please select a pickup location from the suggestions.');
      return;
    }
    if (dest.lat === null || dest.lng === null) {
      setError('Please select a destination from the suggestions.');
      return;
    }
    if (!inChennai(pickup.lat, pickup.lng) || !inChennai(dest.lat, dest.lng)) {
      setError('Both locations must be within Chennai.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post<{ _id: string }>(
        '/api/requests',
        {
          type: 'ride',
          pickupLocation: { lat: pickup.lat, lng: pickup.lng, address: pickup.address },
          destination:    { lat: dest.lat,   lng: dest.lng,   address: dest.address },
        },
        { withCredentials: true }
      );
      navigate(`/passenger/waiting/${res.data._id}`);
    } catch {
      setError('Could not submit your request. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-2xl font-bold text-[var(--color-foreground)]">Book a Ride</h1>

        <form onSubmit={handleSubmit} aria-label="Ride request form" className="flex flex-col gap-5">
          <LocationAutocomplete
            id="pickup-address"
            label="Pickup location"
            placeholder="Type your pickup address…"
            value={pickup.address}
            onChange={(address, lat, lng) => setPickup({ address, lat, lng })}
          />

          {/* Hidden inputs for test injection */}
          <input type="number" step="any" data-testid="pickup-lat" className="sr-only" aria-hidden="true" tabIndex={-1}
            value={pickup.lat ?? ''} onChange={e => setPickup(p => ({ ...p, lat: e.target.value ? Number(e.target.value) : null }))} />
          <input type="number" step="any" data-testid="pickup-lng" className="sr-only" aria-hidden="true" tabIndex={-1}
            value={pickup.lng ?? ''} onChange={e => setPickup(p => ({ ...p, lng: e.target.value ? Number(e.target.value) : null }))} />

          <LocationAutocomplete
            id="dest-address"
            label="Destination"
            placeholder="Type your destination…"
            value={dest.address}
            onChange={(address, lat, lng) => setDest({ address, lat, lng })}
          />

          <input type="number" step="any" data-testid="dest-lat" className="sr-only" aria-hidden="true" tabIndex={-1}
            value={dest.lat ?? ''} onChange={e => setDest(p => ({ ...p, lat: e.target.value ? Number(e.target.value) : null }))} />
          <input type="number" step="any" data-testid="dest-lng" className="sr-only" aria-hidden="true" tabIndex={-1}
            value={dest.lng ?? ''} onChange={e => setDest(p => ({ ...p, lng: e.target.value ? Number(e.target.value) : null }))} />

          {error && (
            <p role="alert" className="text-sm text-[var(--color-destructive)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            {submitting ? 'Submitting…' : 'Request Ride'}
          </button>
        </form>
      </div>
    </main>
  );
}
