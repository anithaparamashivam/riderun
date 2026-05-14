import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import RoleSelection from '../RoleSelection';

const mockUpdateRole = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { userId: 'u1', role: null },
    loading: false,
    logout: vi.fn(),
    updateRole: mockUpdateRole,
  }),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <RoleSelection />
    </MemoryRouter>
  );
}

describe('RoleSelection page', () => {
  beforeEach(() => {
    mockUpdateRole.mockReset().mockResolvedValue(undefined);
  });

  it('renders two role options', () => {
    renderPage();
    expect(screen.getByText(/passenger/i)).toBeInTheDocument();
    expect(screen.getByText(/service provider/i)).toBeInTheDocument();
  });

  it('confirm button is disabled before any selection (AC6)', () => {
    renderPage();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
  });

  it('confirm button is enabled after selecting a role', async () => {
    renderPage();
    await userEvent.click(screen.getByText(/passenger/i));
    expect(screen.getByRole('button', { name: /confirm/i })).not.toBeDisabled();
  });

  it('calls updateRole with passenger when passenger is selected (AC2)', async () => {
    renderPage();
    await userEvent.click(screen.getByText(/passenger/i));
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(mockUpdateRole).toHaveBeenCalledWith('passenger');
  });

  it('calls updateRole with provider when provider is selected (AC3)', async () => {
    renderPage();
    await userEvent.click(screen.getByText(/service provider/i));
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(mockUpdateRole).toHaveBeenCalledWith('provider');
  });
});
