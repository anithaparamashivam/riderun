import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WaitingForProvider from '../WaitingForProvider';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/passenger/waiting/req123']}>
      <Routes>
        <Route path="/passenger/waiting/:requestId" element={<WaitingForProvider />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('WaitingForProvider', () => {
  it('renders "Looking for a provider" message (AC4)', () => {
    renderPage();
    expect(screen.getByText(/looking for a provider/i)).toBeInTheDocument();
  });

  it('has aria-live region for accessible loading announcement (AC4)', () => {
    renderPage();
    const live = document.querySelector('[aria-live]');
    expect(live).not.toBeNull();
    expect(live?.getAttribute('aria-live')).toBe('polite');
  });
});
