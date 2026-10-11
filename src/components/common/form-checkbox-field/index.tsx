import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';

export interface FormCheckboxFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export const FormCheckboxField = <T extends FieldValues>({ name, control, label }: FormCheckboxFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Checkbox label={label} checked={Boolean(field.value)} onChange={field.onChange} />}
    />
  );
};
