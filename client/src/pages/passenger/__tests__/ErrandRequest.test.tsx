import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import ErrandRequest from '../ErrandRequest';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1', role: 'passenger' }, loading: false, logout: vi.fn(), updateRole: vi.fn() }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/passenger/errand']}>
      <Routes>
        <Route path="/passenger/errand" element={<ErrandRequest />} />
        <Route path="/passenger/waiting/:requestId" element={<div>Waiting Screen</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ErrandRequest page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { _id: 'req2', type: 'errand', status: 'pending' } });
  });

  it('renders shop name input and item list textarea (AC1)', () => {
    renderPage();
    expect(screen.getByLabelText(/shop name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/item list/i)).toBeInTheDocument();
  });

  it('shows validation error when shop name is empty on submit (AC2)', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/item list/i), '2x milk');
    await userEvent.click(screen.getByRole('button', { name: /request errand/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows validation error when item list is empty on submit (AC2)', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/shop name/i), 'Reliance Fresh');
    await userEvent.click(screen.getByRole('button', { name: /request errand/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('navigates to waiting screen on successful submission (AC4)', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/shop name/i), 'Reliance Fresh');
    await userEvent.type(screen.getByLabelText(/item list/i), '2x milk, 1x bread');
    await userEvent.click(screen.getByRole('button', { name: /request errand/i }));
    await waitFor(() => expect(screen.getByText('Waiting Screen')).toBeInTheDocument());
  });
});
