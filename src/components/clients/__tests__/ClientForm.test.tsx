import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mocks = vi.hoisted(() => ({
  createMutate: vi.fn(),
  updateMutate: vi.fn(),
  selectedFile: null as File | null,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

vi.mock('../../../hooks/useClients', () => ({
  useCreateClient: () => ({ mutate: mocks.createMutate, isPending: false }),
  useUpdateClient: () => ({ mutate: mocks.updateMutate, isPending: false }),
}));

// Stub out FileUpload to a simple test-controlled trigger. The real component
// uses react-dropzone — overkill for unit-testing form wiring.
vi.mock('../../ui/FileUpload', () => ({
  default: ({ onFileSelect }: { onFileSelect: (f: File | null) => void }) => (
    <button
      type="button"
      data-testid="upload-logo"
      onClick={() =>
        onFileSelect(new File(['fake'], 'logo.png', { type: 'image/png' }))
      }
    >
      pick-logo
    </button>
  ),
}));

// Modal renders via createPortal — keep it simple for the test.
vi.mock('../../ui/Modal', () => ({
  default: ({ isOpen, children, title }: any) =>
    isOpen ? (
      <div role="dialog" aria-label={title}>
        {children}
      </div>
    ) : null,
}));

// ClientConnections only renders in edit mode and reaches into more hooks
// (Meta + Google Ads). Stub it out — its behavior belongs to its own tests.
vi.mock('../ClientConnections', () => ({
  default: () => <div data-testid="client-connections" />,
}));

import ClientForm from '../ClientForm';

const renderForm = (props: Partial<React.ComponentProps<typeof ClientForm>> = {}) =>
  render(
    <ClientForm isOpen onClose={vi.fn()} client={null} {...props} />,
  );

describe('<ClientForm />', () => {
  beforeEach(() => {
    mocks.createMutate.mockReset();
    mocks.updateMutate.mockReset();
    mocks.selectedFile = null;
  });

  describe('create mode', () => {
    it('rejects submission without a logo and surfaces clients.logoRequired', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText('clients.name'), 'Acme');
      // Description input is the textarea (no aria label) — find it via role.
      await user.type(
        screen.getByRole('textbox', { name: '' }) // textarea fallback
          ?? screen.getByPlaceholderText('clients.descriptionPlaceholder'),
        'A solid brand',
      );

      await user.click(screen.getByRole('button', { name: 'common.save' }));

      await waitFor(() =>
        expect(mocks.createMutate).not.toHaveBeenCalled(),
      );
      expect(await screen.findByText('clients.logoRequired')).toBeInTheDocument();
    });

    it('submits FormData containing name, description, and logo on success', async () => {
      const onClose = vi.fn();
      mocks.createMutate.mockImplementation((_data, opts) => {
        opts?.onSuccess?.();
      });

      const user = userEvent.setup();
      renderForm({ onClose });

      await user.type(screen.getByLabelText('clients.name'), 'Acme');
      await user.type(
        screen.getByPlaceholderText('clients.descriptionPlaceholder'),
        'A solid brand',
      );
      await user.click(screen.getByTestId('upload-logo'));
      await user.click(screen.getByRole('button', { name: 'common.save' }));

      await waitFor(() => expect(mocks.createMutate).toHaveBeenCalledTimes(1));
      const [submittedFormData] = mocks.createMutate.mock.calls[0];
      expect(submittedFormData).toBeInstanceOf(FormData);
      expect(submittedFormData.get('name')).toBe('Acme');
      expect(submittedFormData.get('description')).toBe('A solid brand');
      expect(submittedFormData.get('logo')).toBeInstanceOf(File);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit mode', () => {
    const existingClient = {
      _id: 'client-1',
      name: 'Old Name',
      description: 'Old desc',
      logo: 'logos/old.png',
    };

    it('pre-fills the form with the existing client values', () => {
      renderForm({ client: existingClient as any });

      expect(screen.getByLabelText('clients.name')).toHaveValue('Old Name');
      expect(
        screen.getByPlaceholderText('clients.descriptionPlaceholder'),
      ).toHaveValue('Old desc');
    });

    it('submits an update without requiring a new logo', async () => {
      const onClose = vi.fn();
      mocks.updateMutate.mockImplementation((_payload, opts) =>
        opts?.onSuccess?.(),
      );

      const user = userEvent.setup();
      renderForm({ client: existingClient as any, onClose });

      await user.click(screen.getByRole('button', { name: 'common.save' }));

      await waitFor(() => expect(mocks.updateMutate).toHaveBeenCalledTimes(1));
      const [{ id, formData }] = mocks.updateMutate.mock.calls[0];
      expect(id).toBe('client-1');
      expect(formData.get('name')).toBe('Old Name');
      expect(formData.has('logo')).toBe(false); // no file selected → not appended
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
