import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProviderServiceComplete from '../ServiceComplete';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Provider ServiceComplete', () => {
  it('shows Service Complete heading (AC7)', () => {
    render(
      <MemoryRouter>
        <ProviderServiceComplete />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /service complete/i })).toBeInTheDocument();
  });

  it('Back to Home navigates to /provider (AC7)', () => {
    render(
      <MemoryRouter>
        <ProviderServiceComplete />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/provider');
  });
});
