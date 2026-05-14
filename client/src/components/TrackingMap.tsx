import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const CHENNAI_CENTER = { lat: 13.0827, lng: 80.2707 };

interface Props {
  position: { lat: number; lng: number } | null;
  apiKey: string;
}

export default function TrackingMap({ position, apiKey }: Props) {
  return (
    <div
      className="relative w-full h-64 md:h-96"
      role="application"
      aria-label="Provider tracking map"
    >
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={position ?? CHENNAI_CENTER}
          zoom={14}
        >
          {position && (
            <Marker
              position={position}
              icon={{
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeWeight: 0,
                scale: 1.4,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {!position && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-[var(--color-primary)]"
            role="status"
            aria-label="Loading"
          />
          <p className="text-sm text-zinc-500">Waiting for provider's location…</p>
        </div>
      )}
    </div>
  );
}
