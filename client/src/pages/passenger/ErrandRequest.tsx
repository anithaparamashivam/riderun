import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ErrandRequest() {
  const navigate = useNavigate();
  const [shopName, setShopName]   = useState('');
  const [itemList, setItemList]   = useState('');
  const [error, setError]         = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!shopName.trim()) {
      setError('Please enter a shop name.');
      return;
    }
    if (!itemList.trim()) {
      setError('Please enter the items you need.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post<{ _id: string }>(
        '/api/requests',
        { type: 'errand', shopName: shopName.trim(), itemList: itemList.trim() },
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
        <h1 className="mb-8 text-2xl font-bold text-[var(--color-foreground)]">Request an Errand</h1>

        <form onSubmit={handleSubmit} aria-label="Errand request form">
          {/* Shop name */}
          <div className="mb-4">
            <label htmlFor="shop-name" className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
              Shop name
            </label>
            <input
              id="shop-name"
              type="text"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              placeholder="e.g. Reliance Fresh, Spencer's"
              className="w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-[var(--color-foreground)] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
            />
          </div>

          {/* Item list */}
          <div className="mb-6">
            <label htmlFor="item-list" className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
              Item list
            </label>
            <textarea
              id="item-list"
              rows={4}
              value={itemList}
              onChange={e => setItemList(e.target.value)}
              placeholder="e.g. 2x milk, 1x bread, 500g paneer"
              className="w-full rounded-lg border border-[var(--color-border)] bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-[var(--color-foreground)] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] resize-none"
            />
          </div>

          {error && (
            <p role="alert" className="mb-4 text-sm text-[var(--color-destructive)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            {submitting ? 'Submitting…' : 'Request Errand'}
          </button>
        </form>
      </div>
    </main>
  );
}
