import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormCheckboxField } from '@/components/common/form-checkbox-field';
import { FormTextField } from '@/components/common/form-text-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { useAction } from '@/hooks/useAction';
import { formatDateTime } from '@/utils/format';
import { singleValueSchema, type SingleValueFormValues } from '../settings.schema';

export interface SingleValueCardProps {
  title: string;
  label: string;
  value: number;
  isActive: boolean;
  updatedAt: string;
  onSave: (value: number, isActive: boolean) => Promise<unknown>;
}

export const SingleValueCard = ({ title, label, value, isActive, updatedAt, onSave }: SingleValueCardProps) => {
  const { run, busy } = useAction();
  const form = useForm({
    resolver: yupResolver(singleValueSchema),
    defaultValues: { value, isActive },
  });
  const [draft, active] = useWatch({ control: form.control, name: ['value', 'isActive'] });
  const changed = Number(draft) !== value || active !== isActive;

  const submit = (values: SingleValueFormValues) => run(() => onSave(values.value, values.isActive), `${title} saved`);

  return (
    <Card title={title}>
      <Form onSubmit={form.handleSubmit(submit)}>
        <FormTextField name="value" control={form.control} label={label} type="number" min={0} step="any" />
        <FormCheckboxField name="isActive" control={form.control} label="Active" />
        <Paragraph color="var(--text-muted)">Last changed {formatDateTime(updatedAt)}</Paragraph>
        <Stack direction="row">
          <Button type="submit" variant="primary" disabled={busy || !changed}>
            Save
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};
