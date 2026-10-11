import { useId, type ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/utils/apiError';

export interface FormModalProps<TFieldValues extends FieldValues, TValues, TResult> {
  title: string;
  submitText: string;
  successMessage: string | ((result: TResult) => string);
  form: UseFormReturn<TFieldValues, unknown, TValues>;
  onSubmit: (values: TValues) => Promise<TResult>;
  onClose: () => void;
  canSubmit?: boolean;
  danger?: boolean;
  wide?: boolean;
  children: ReactNode;
}

export const FormModal = <TFieldValues extends FieldValues, TValues, TResult>({
  title,
  submitText,
  successMessage,
  form,
  onSubmit,
  onClose,
  canSubmit = true,
  danger,
  wide,
  children,
}: FormModalProps<TFieldValues, TValues, TResult>) => {
  const formId = useId();
  const toast = useToast();
  const { isSubmitting } = form.formState;

  const submit = async (values: TValues) => {
    try {
      const result = await onSubmit(values);
      toast.success(typeof successMessage === 'function' ? successMessage(result) : successMessage);
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      wide={wide}
      footer={
        <>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant={danger ? 'danger' : 'primary'} disabled={isSubmitting || !canSubmit}>
            {isSubmitting ? 'Working...' : submitText}
          </Button>
        </>
      }
    >
      <Form id={formId} onSubmit={form.handleSubmit(submit)}>
        {children}
      </Form>
    </Modal>
  );
};
