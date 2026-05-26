import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Mock the auth hooks before importing LoginForm — the component grabs them
// at module load time via React Query, so we intercept at the module level.
const loginMutate = vi.fn();
const resendMutate = vi.fn();
let loginIsPending = false;

vi.mock('../../../hooks/useAuth', () => ({
  useLogin: () => ({ mutate: loginMutate, isPending: loginIsPending }),
  useResendVerification: () => ({ mutate: resendMutate, isPending: false }),
}));

// react-i18next: keep the component renderable without spinning up i18next.
// Using identity translations means we can assert against the keys.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

// framer-motion is mocked globally in src/test/setup.ts.

import LoginForm from '../LoginForm';

const renderForm = () =>
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  );

describe('<LoginForm />', () => {
  beforeEach(() => {
    loginMutate.mockReset();
    resendMutate.mockReset();
    loginIsPending = false;
  });

  it('renders email + password inputs and a submit button', () => {
    renderForm();

    expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'auth.login' }),
    ).toBeInTheDocument();
  });

  it('blocks submission when the password is too short (< 6 chars)', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('auth.email'), 'user@example.com');
    await user.type(screen.getByLabelText('auth.password'), 'abc');
    await user.click(screen.getByRole('button', { name: 'auth.login' }));

    // zod's min-length error must keep the mutation from firing.
    await waitFor(() => expect(loginMutate).not.toHaveBeenCalled());
  });

  it('calls the login mutation with the form payload on a valid submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('auth.email'), 'user@example.com');
    await user.type(screen.getByLabelText('auth.password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'auth.login' }));

    await waitFor(() => expect(loginMutate).toHaveBeenCalledTimes(1));
    expect(loginMutate).toHaveBeenCalledWith(
      { email: 'user@example.com', password: 'secret123' },
      expect.any(Object),
    );
  });

  it('shows the inline error banner with the backend message when login fails', async () => {
    const user = userEvent.setup();
    // Simulate the mutation handing us back a 401 + backend message.
    loginMutate.mockImplementation((_data, opts) => {
      opts?.onError?.({
        response: { status: 401, data: { message: 'Invalid email or password.' } },
      });
    });

    renderForm();

    await user.type(screen.getByLabelText('auth.email'), 'user@example.com');
    await user.type(screen.getByLabelText('auth.password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'auth.login' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Invalid email or password.');
  });

  it('reveals the resend-verification button when login fails with a 403', async () => {
    const user = userEvent.setup();
    loginMutate.mockImplementation((_data, opts) => {
      opts?.onError?.({
        response: {
          status: 403,
          data: { message: 'Please verify your email before logging in.' },
        },
      });
    });

    renderForm();

    await user.type(screen.getByLabelText('auth.email'), 'user@example.com');
    await user.type(screen.getByLabelText('auth.password'), 'secret123');
    await user.click(screen.getByRole('button', { name: 'auth.login' }));

    expect(
      await screen.findByRole('button', { name: 'auth.resendVerification' }),
    ).toBeInTheDocument();
  });
});
