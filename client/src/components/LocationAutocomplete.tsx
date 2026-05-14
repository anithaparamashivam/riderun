import { useState, useRef } from 'react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (address: string, lat: number | null, lng: number | null) => void;
}

export default function LocationAutocomplete({ id, label, placeholder, value, onChange }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    onChange(q, null, null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 3) { setSuggestions([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Chennai, India')}&format=json&limit=5&countrycodes=in&accept-language=en`,
          { headers: { 'User-Agent': 'RideRun-App/1.0' } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 350);
  }

  function select(s: Suggestion) {
    onChange(s.display_name, parseFloat(s.lat), parseFloat(s.lon));
    setSuggestions([]);
    setOpen(false);
  }

  function handleBlur() {
    // Delay close so click on suggestion fires first
    setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleInput}
        onBlur={handleBlur}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-[var(--color-foreground)] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
      />
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-zinc-900 shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              onMouseDown={() => select(s)}
              className="cursor-pointer px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
