import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormModal } from '@/components/common/form-modal';
import { FORM_MESSAGES } from '@/constants/messages';

export interface StatusChangeModalProps<S extends string> {
  title: string;
  current: S;
  options: readonly S[];
  onSubmit: (status: S) => Promise<unknown>;
  onClose: () => void;
}

export const StatusChangeModal = <S extends string>({ title, current, options, onSubmit, onClose }: StatusChangeModalProps<S>) => {
  const schema = yup.object({
    status: yup.string().oneOf(options as readonly string[]).required(FORM_MESSAGES.REQUIRED),
  });
  const form = useForm({ resolver: yupResolver(schema), defaultValues: { status: current as string } });
  const status = useWatch({ control: form.control, name: 'status' });

  return (
    <FormModal
      title={title}
      submitText="Save"
      successMessage={`Status changed to ${status}`}
      form={form}
      canSubmit={status !== current}
      onSubmit={(values) => onSubmit(values.status as S)}
      onClose={onClose}
    >
      <FormSelectField name="status" control={form.control} label="Status" options={options} />
    </FormModal>
  );
};
