import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Select, type SelectOption } from '@/components/ui/select';
import { FormField } from '@/components/common/form-field';

export interface FormSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const FormSelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  disabled,
}: FormSelectFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField label={label} error={fieldState.error?.message}>
          <Select
            value={field.value === undefined || field.value === null ? '' : String(field.value)}
            onChange={field.onChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth
          />
        </FormField>
      )}
    />
  );
};
