import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import ProviderHome from '../Home';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { userId: 'u1', role: 'provider' },
    loading: false,
    logout: vi.fn(),
    updateRole: vi.fn(),
  }),
}));

function renderHome() {
  return render(
    <MemoryRouter>
      <ProviderHome />
    </MemoryRouter>
  );
}

describe('ProviderHome', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: { name: 'Ravi Kumar', isOnline: false },
    });
    mockedAxios.patch = vi.fn().mockResolvedValue({
      data: { isOnline: true },
    });
  });

  it('renders the provider home screen (AC1)', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('Ravi Kumar').length).toBeGreaterThan(0));
  });

  it('shows Offline status when isOnline is false (AC1)', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText(/offline/i)).toBeInTheDocument());
  });

  it('shows Online status after going online (AC2)', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { name: 'Ravi Kumar', isOnline: true } });
    renderHome();
    await waitFor(() => expect(screen.getByText(/online/i)).toBeInTheDocument());
  });

  it('disables toggle while update is in flight (AC5)', async () => {
    let resolveToggle!: (v: unknown) => void;
    mockedAxios.patch = vi.fn().mockReturnValue(
      new Promise(res => { resolveToggle = res; })
    );
    renderHome();
    await waitFor(() => screen.getByRole('button', { name: /toggle/i }));
    await userEvent.click(screen.getByRole('button', { name: /toggle/i }));
    expect(screen.getByRole('button', { name: /toggle/i })).toBeDisabled();
    resolveToggle({ data: { isOnline: true } });
  });

  it('reverts toggle and shows error on network failure (AC6)', async () => {
    mockedAxios.patch = vi.fn().mockRejectedValue(new Error('Network error'));
    renderHome();
    await waitFor(() => screen.getByRole('button', { name: /toggle/i }));
    await userEvent.click(screen.getByRole('button', { name: /toggle/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });
});
