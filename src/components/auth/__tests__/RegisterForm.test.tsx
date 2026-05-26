import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const mocks = vi.hoisted(() => ({
  registerMutate: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock('../../../hooks/useAuth', () => ({
  useRegister: () => ({ mutate: mocks.registerMutate, isPending: false }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'es', changeLanguage: vi.fn() },
  }),
}));

vi.mock('react-router-dom', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

import RegisterForm from '../RegisterForm';

const renderForm = () =>
  render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>,
  );

describe('<RegisterForm />', () => {
  beforeEach(() => {
    mocks.registerMutate.mockReset();
    mocks.navigate.mockReset();
  });

  it('renders all four required inputs and a submit button', () => {
    renderForm();
    expect(screen.getByLabelText('auth.firstName')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.lastName')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'auth.register' })).toBeInTheDocument();
  });

  it('passes the current i18n language to the register payload', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('auth.firstName'), 'Ada');
    await user.type(screen.getByLabelText('auth.lastName'), 'Lovelace');
    await user.type(screen.getByLabelText('auth.email'), 'ada@example.com');
    await user.type(screen.getByLabelText('auth.password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'auth.register' }));

    await waitFor(() => expect(mocks.registerMutate).toHaveBeenCalledTimes(1));
    expect(mocks.registerMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        password: 'secret123',
        // The mocked i18n.language is 'es' — the form must forward it so the
        // newly created account inherits the user's chosen language.
        language: 'es',
      }),
      expect.any(Object),
    );
  });

  it('blocks submit when first name is too short', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('auth.firstName'), 'A');
    await user.type(screen.getByLabelText('auth.lastName'), 'Lovelace');
    await user.type(screen.getByLabelText('auth.email'), 'ada@example.com');
    await user.type(screen.getByLabelText('auth.password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'auth.register' }));

    await waitFor(() => expect(mocks.registerMutate).not.toHaveBeenCalled());
  });

  it('navigates to /login after a successful register', async () => {
    const user = userEvent.setup();
    mocks.registerMutate.mockImplementation((_data, opts) => {
      opts?.onSuccess?.();
    });
    renderForm();

    await user.type(screen.getByLabelText('auth.firstName'), 'Ada');
    await user.type(screen.getByLabelText('auth.lastName'), 'Lovelace');
    await user.type(screen.getByLabelText('auth.email'), 'ada@example.com');
    await user.type(screen.getByLabelText('auth.password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'auth.register' }));

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/login'));
  });
});
