import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSaveFleetPlanMutation } from '@/api/endpoints/fleetApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { Table, type Column } from '@/components/ui/table';
import { useAction } from '@/hooks/useAction';
import type { FleetPlan } from '@/types/fleet.types';
import { formatDateTime } from '@/utils/format';
import { cityTargetsSchema, type CityTargetsFormValues } from '../fleet.schema';
import styles from './CityTargetsCard.module.scss';

export interface CityTargetsCardProps {
  plan: FleetPlan;
}

interface TargetRow {
  index: number;
  city: string;
  currentCars: number;
  targetCars: number;
}

export const CityTargetsCard = ({ plan }: CityTargetsCardProps) => {
  const [saveFleetPlan] = useSaveFleetPlanMutation();
  const { run, busy } = useAction();
  const form = useForm<CityTargetsFormValues>({
    resolver: yupResolver(cityTargetsSchema),
    defaultValues: { targets: plan.targets },
  });
  const watched = useWatch({ control: form.control, name: 'targets' });
  const rows: TargetRow[] = plan.targets.map((target, index) => ({
    index,
    city: target.city,
    currentCars: target.currentCars,
    targetCars: Number(watched[index]?.targetCars ?? target.targetCars),
  }));
  const changed = rows.some((row) => row.targetCars !== plan.targets[row.index]?.targetCars);

  const submit = (values: CityTargetsFormValues) => run(() => saveFleetPlan(values.targets).unwrap(), 'Fleet plan saved');

  const columns: Column<TargetRow>[] = [
    { key: 'city', header: 'City', render: (row) => row.city },
    { key: 'current', header: 'Cars now', render: (row) => row.currentCars },
    {
      key: 'target',
      header: 'Target',
      render: (row) => (
        <Controller
          name={`targets.${row.index}.targetCars`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Stack gap="xs">
              <Input
                className={styles.targetInput}
                type="number"
                min={0}
                aria-label={`${row.city} target`}
                name={field.name}
                ref={field.ref}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={Boolean(fieldState.error)}
              />
              {fieldState.error && (
                <Span color="var(--danger)" size="12px" lineHeight="16px">
                  {fieldState.error.message}
                </Span>
              )}
            </Stack>
          )}
        />
      ),
    },
    {
      key: 'difference',
      header: 'Difference',
      render: (row) => {
        const diff = row.currentCars - row.targetCars;
        return <Span color={diff < 0 ? 'var(--danger)' : 'inherit'}>{diff > 0 ? `+${diff}` : diff}</Span>;
      },
    },
  ];

  return (
    <Card gap="md">
      <Form onSubmit={form.handleSubmit(submit)}>
        <Table columns={columns} rows={rows} rowKey={(row) => row.city} />
        <Stack direction="row" gap="xs" align="center" justify="between" wrap>
          <Span color="var(--text-muted)">Last changed {formatDateTime(plan.updatedAt)}</Span>
          <Button type="submit" variant="primary" disabled={busy || !changed}>
            Save targets
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};
