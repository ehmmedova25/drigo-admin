import { useState } from 'react';
import {
  useDeleteCustomerDebtMutation,
  useGetCustomerDebtsQuery,
  usePayAllDebtsMutation,
  usePayDebtMutation,
  usePaySelectedDebtsMutation,
} from '@/api/endpoints/debtsApi';
import { ActionModal } from '@/components/common/action-modal';
import { DataTable, type Column } from '@/components/common/data-table';
import { AddDebtModal, SplitDebtModal } from '@/components/common/debt-modals';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { useAction } from '@/hooks/useAction';
import type { Debt } from '@/types/debts.types';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney } from '@/utils/format';

type PanelModal = { kind: 'add' } | { kind: 'payAll' } | { kind: 'split'; debt: Debt } | { kind: 'remove'; debt: Debt };

export interface DebtPanelProps {
  userId: string;
}

export const DebtPanel = ({ userId }: DebtPanelProps) => {
  const { data, isLoading, error, refetch } = useGetCustomerDebtsQuery(userId);
  const [payAllDebts] = usePayAllDebtsMutation();
  const [paySelectedDebts] = usePaySelectedDebtsMutation();
  const [payDebt] = usePayDebtMutation();
  const [deleteDebt] = useDeleteCustomerDebtMutation();
  const { run, busy } = useAction();
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<PanelModal | null>(null);

  if (isLoading) return <Loader />;
  if (error || !data) return <ErrorState error={getErrorMessage(error)} onRetry={refetch} />;

  const unpaidCount = data.debts.filter((debt) => !debt.isPaid).length;
  const toggle = (id: number) => setSelected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const paySelected = async () => {
    if (await run(() => paySelectedDebts({ userId, debtIds: selected }).unwrap(), `${selected.length} debt(s) paid`)) setSelected([]);
  };

  const closeModal = () => setModal(null);

  const columns: Column<Debt>[] = [
    {
      key: 'select',
      header: '',
      render: (debt) => !debt.isPaid && <Checkbox ariaLabel={`Select debt ${debt.id}`} checked={selected.includes(debt.id)} onChange={() => toggle(debt.id)} />,
    },
    { key: 'id', header: '#', render: (debt) => debt.id },
    { key: 'type', header: 'Type', render: (debt) => debt.type },
    { key: 'desc', header: 'Description', render: (debt) => debt.description },
    { key: 'amount', header: 'Amount', render: (debt) => formatMoney(debt.amount, debt.currency) },
    { key: 'status', header: 'Status', render: (debt) => <StatusBadge status={debt.isPaid ? 'Paid' : 'Unpaid'} /> },
    { key: 'created', header: 'Created', render: (debt) => formatDateTime(debt.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (debt) => (
        <Stack direction="row" gap="xs" align="center">
          {!debt.isPaid && (
            <>
              <Button size="sm" disabled={busy} onClick={() => run(() => payDebt({ userId, debtId: debt.id }).unwrap(), `Debt #${debt.id} paid`)}>
                Pay
              </Button>
              <Button size="sm" onClick={() => setModal({ kind: 'split', debt })}>
                Split
              </Button>
            </>
          )}
          <Button size="sm" onClick={() => setModal({ kind: 'remove', debt })}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Stack direction="row" align="center" justify="between" gap="sm" wrap>
        <Heading as="h3" size="16px" lineHeight="24px" weight="500">
          Total unpaid: {formatMoney(data.totalDebt, data.currency)}
        </Heading>
        <Stack direction="row" gap="xs" align="center" wrap>
          <Button variant="primary" disabled={unpaidCount === 0} onClick={() => setModal({ kind: 'payAll' })}>
            Pay all
          </Button>
          <Button disabled={busy || selected.length === 0} onClick={paySelected}>
            Pay selected ({selected.length})
          </Button>
          <Button onClick={() => setModal({ kind: 'add' })}>Add debt</Button>
        </Stack>
      </Stack>
      <DataTable columns={columns} rows={data.debts} rowKey={(debt) => debt.id} emptyText="This customer has no debts." />

      {modal?.kind === 'add' && <AddDebtModal userId={userId} onClose={closeModal} />}
      {modal?.kind === 'split' && <SplitDebtModal userId={userId} debt={modal.debt} onClose={closeModal} />}
      {modal?.kind === 'payAll' && (
        <ActionModal
          title="Collect all debts"
          submitText="Pay all"
          successMessage="All debts paid"
          onSubmit={() => payAllDebts(userId).unwrap()}
          onClose={closeModal}
        >
          <Paragraph>
            Mark all {unpaidCount} unpaid debts ({formatMoney(data.totalDebt, data.currency)}) as paid?
          </Paragraph>
        </ActionModal>
      )}
      {modal?.kind === 'remove' && (
        <ActionModal
          title="Delete debt"
          submitText="Delete"
          successMessage="Debt deleted"
          danger
          onSubmit={() => deleteDebt({ userId, debtId: modal.debt.id }).unwrap()}
          onClose={closeModal}
        >
          <Paragraph>
            Delete debt #{modal.debt.id} ({formatMoney(modal.debt.amount, modal.debt.currency)})? This cannot be undone.
          </Paragraph>
        </ActionModal>
      )}
    </>
  );
};
