interface ServiceCardProps {
  label: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export default function ServiceCard({ label, description, icon, onClick }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-white dark:bg-zinc-900 p-8 text-center transition hover:border-[var(--color-primary)] hover:bg-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] w-full"
      aria-label={label}
    >
      <span className="text-5xl" aria-hidden="true">{icon}</span>
      <span className="text-lg font-semibold text-[var(--color-foreground)]">{label}</span>
      <span className="text-sm text-zinc-500">{description}</span>
    </button>
  );
}
