import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ServiceCard from '../ServiceCard';

describe('ServiceCard', () => {
  it('renders the label', () => {
    render(<ServiceCard label="Ride" description="Book a ride" icon="🚗" onClick={vi.fn()} />);
    expect(screen.getByText('Ride')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<ServiceCard label="Ride" description="Book a ride" icon="🚗" onClick={vi.fn()} />);
    expect(screen.getByText('Book a ride')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<ServiceCard label="Ride" description="Book a ride" icon="🚗" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: /ride/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
