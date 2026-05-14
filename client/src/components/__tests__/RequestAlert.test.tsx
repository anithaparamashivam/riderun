import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import RequestAlert from '../RequestAlert';

const RIDE_REQUEST = {
  requestId: 'req1',
  type: 'ride' as const,
  pickupLocation: { address: 'Anna Nagar, Chennai' },
  destination: { address: 'T. Nagar, Chennai' },
};

const ERRAND_REQUEST = {
  requestId: 'req2',
  type: 'errand' as const,
  shopName: 'Reliance Fresh',
  itemList: '2x milk, 1x bread',
};

describe('RequestAlert', () => {
  it('renders ride request details (AC1)', () => {
    render(
      <RequestAlert
        request={RIDE_REQUEST}
        onAccept={vi.fn()}
        onDecline={vi.fn()}
      />
    );
    expect(screen.getByText(/ride/i)).toBeInTheDocument();
    expect(screen.getByText(/anna nagar/i)).toBeInTheDocument();
    expect(screen.getByText(/t\. nagar/i)).toBeInTheDocument();
  });

  it('renders errand request details (AC1)', () => {
    render(
      <RequestAlert
        request={ERRAND_REQUEST}
        onAccept={vi.fn()}
        onDecline={vi.fn()}
      />
    );
    expect(screen.getByText(/errand/i)).toBeInTheDocument();
    expect(screen.getByText(/reliance fresh/i)).toBeInTheDocument();
    expect(screen.getByText(/2x milk/i)).toBeInTheDocument();
  });

  it('calls onAccept when Accept is clicked (AC2)', async () => {
    const onAccept = vi.fn();
    render(
      <RequestAlert
        request={RIDE_REQUEST}
        onAccept={onAccept}
        onDecline={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /accept/i }));
    expect(onAccept).toHaveBeenCalledWith('req1');
  });

  it('calls onDecline when Decline is clicked (AC3)', async () => {
    const onDecline = vi.fn();
    render(
      <RequestAlert
        request={RIDE_REQUEST}
        onAccept={vi.fn()}
        onDecline={onDecline}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /decline/i }));
    expect(onDecline).toHaveBeenCalledWith('req1');
  });

  it('auto-dismisses after 30 seconds (AC5)', async () => {
    const onDecline = vi.fn();
    vi.useFakeTimers();

    render(
      <RequestAlert
        request={RIDE_REQUEST}
        onAccept={vi.fn()}
        onDecline={onDecline}
      />
    );

    for (let i = 0; i < 30; i++) {
      await act(async () => { vi.advanceTimersByTime(1000); });
    }
    expect(onDecline).toHaveBeenCalledWith('req1');

    vi.useRealTimers();
  });

  it('shows countdown in the alert (AC5)', async () => {
    vi.useFakeTimers();

    render(
      <RequestAlert
        request={RIDE_REQUEST}
        onAccept={vi.fn()}
        onDecline={vi.fn()}
      />
    );

    expect(screen.getByText(/30s/)).toBeInTheDocument();

    for (let i = 0; i < 5; i++) {
      await act(async () => { vi.advanceTimersByTime(1000); });
    }
    expect(screen.getByText(/25s/)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
