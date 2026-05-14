import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PassengerServiceComplete from '../ServiceComplete';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function render400(requestId = 'req-done', type = 'ride', summary = 'Ride to Airport') {
  return render(
    <MemoryRouter initialEntries={[`/passenger/complete/${requestId}`]}>
      <Routes>
        <Route
          path="/passenger/complete/:requestId"
          element={<PassengerServiceComplete requestType={type} summary={summary} />}
        />
        <Route path="/passenger" element={<div>Passenger Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Passenger ServiceComplete', () => {
  it('shows completion message (AC5)', () => {
    render400();
    expect(screen.getByText(/your service is complete/i)).toBeInTheDocument();
  });

  it('shows service summary (AC5)', () => {
    render400('req-1', 'ride', 'Ride to Airport');
    expect(screen.getByText(/ride to airport/i)).toBeInTheDocument();
  });

  it('Back to Home button navigates to /passenger (AC5)', () => {
    render400();
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/passenger');
  });
});
