import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useAction } from '@/hooks/useAction';

export interface ActionModalProps<R> {
  title: string;
  submitText: string;
  successMessage: string | ((result: R) => string);
  onSubmit: () => Promise<R>;
  onClose: () => void;
  canSubmit?: boolean;
  danger?: boolean;
  wide?: boolean;
  children?: ReactNode;
}

export const ActionModal = <R,>({
  title,
  submitText,
  successMessage,
  onSubmit,
  onClose,
  canSubmit = true,
  danger,
  wide,
  children,
}: ActionModalProps<R>) => {
  const { run, busy } = useAction();

  const submit = async () => {
    if (await run(onSubmit, successMessage)) onClose();
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      wide={wide}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={submit} disabled={busy || !canSubmit}>
            {busy ? 'Working...' : submitText}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
};
