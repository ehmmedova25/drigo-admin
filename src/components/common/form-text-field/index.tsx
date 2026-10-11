import type { InputHTMLAttributes } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/form-field';

type NativeInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'placeholder' | 'autoFocus' | 'min' | 'max' | 'step' | 'maxLength'
>;

export interface FormTextFieldProps<T extends FieldValues> extends NativeInputProps {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export const FormTextField = <T extends FieldValues>({ name, control, label, type = 'text', ...inputProps }: FormTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message}>
          <Input
            {...inputProps}
            name={field.name}
            ref={field.ref}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            type={type}
            fullWidth
            error={Boolean(fieldState.error)}
          />
        </FormField>
      )}
    />
  );
};
