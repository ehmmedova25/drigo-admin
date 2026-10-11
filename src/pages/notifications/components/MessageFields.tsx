import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextareaField } from '@/components/common/form-textarea-field';
import { FormTextField } from '@/components/common/form-text-field';
import { AUDIENCES } from '@/constants/notifications';
import type { BroadcastFormValues } from '../notifications.schema';

export interface MessageFieldsProps<T extends FieldValues> {
  control: Control<T>;
}

export const MessageFields = <T extends FieldValues>({ control }: MessageFieldsProps<T>) => {
  const fieldName = (name: keyof BroadcastFormValues) => name as Path<T>;

  return (
    <>
      <FormTextField name={fieldName('title')} control={control} label="Title" />
      <FormTextareaField name={fieldName('body')} control={control} label="Message" />
      <FormSelectField name={fieldName('targetAudience')} control={control} label="Audience" options={AUDIENCES} />
    </>
  );
};
