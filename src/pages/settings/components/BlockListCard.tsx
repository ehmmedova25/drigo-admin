import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { DataTable } from '@/components/common/data-table';
import { FormTextField } from '@/components/common/form-text-field';
import { RowActions } from '@/components/common/row-actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Code } from '@/components/ui/code';
import { Form } from '@/components/ui/form';
import { Stack } from '@/components/ui/stack';
import { useAction } from '@/hooks/useAction';
import { formatDateTime } from '@/utils/format';
import type { ListState } from '@/utils/queryState';
import type { BlockEntryFormValues } from '../settings.schema';

export interface BlockedEntry {
  value: string;
  reason: string;
  blockedAt: string;
}

export interface BlockListCardProps {
  title: string;
  label: string;
  placeholder: string;
  list: ListState<BlockedEntry>;
  schema: ObjectSchema<BlockEntryFormValues>;
  onBlock: (value: string, reason: string) => Promise<unknown>;
  onUnblock: (value: string) => Promise<unknown>;
}

export const BlockListCard = ({ title, label, placeholder, list, schema, onBlock, onUnblock }: BlockListCardProps) => {
  const { run, busy } = useAction();
  const form = useForm({ resolver: yupResolver(schema), defaultValues: { value: '', reason: '' } });

  const block = async (values: BlockEntryFormValues) => {
    if (await run(() => onBlock(values.value, values.reason), `${values.value} blocked`)) {
      form.reset();
    }
  };

  return (
    <Card title={title}>
      <Form onSubmit={form.handleSubmit(block)}>
        <Stack direction="row" gap="xs" align="end" wrap>
          <FormTextField name="value" control={form.control} label={label} placeholder={placeholder} />
          <FormTextField name="reason" control={form.control} label="Reason" placeholder="Reason" />
          <Button type="submit" variant="primary" disabled={busy}>
            Block
          </Button>
        </Stack>
      </Form>
      <DataTable
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRetry={list.reload}
        rowKey={(entry) => entry.value}
        emptyText="Nothing blocked"
        columns={[
          { key: 'value', header: 'Blocked', render: (entry) => <Code>{entry.value}</Code> },
          { key: 'reason', header: 'Reason', render: (entry) => entry.reason },
          { key: 'at', header: 'Since', render: (entry) => formatDateTime(entry.blockedAt) },
          {
            key: 'actions',
            header: '',
            render: (entry) => (
              <RowActions
                actions={[{ label: 'Unblock', onClick: () => run(() => onUnblock(entry.value), `${entry.value} unblocked`) }]}
              />
            ),
          },
        ]}
      />
    </Card>
  );
};
