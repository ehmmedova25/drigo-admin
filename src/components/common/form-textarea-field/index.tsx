import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/common/form-field';

export interface FormTextareaFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  rows?: number;
  placeholder?: string;
}

export const FormTextareaField = <T extends FieldValues>({ name, control, label, rows, placeholder }: FormTextareaFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message}>
          <Textarea
            name={field.name}
            ref={field.ref}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            rows={rows}
            placeholder={placeholder}
          />
        </FormField>
      )}
    />
  );
};
