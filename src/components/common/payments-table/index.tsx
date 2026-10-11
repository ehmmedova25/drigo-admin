import { useRetryPaymentMutation } from '@/api/endpoints/rentalsApi';
import { DataTable, type Column } from '@/components/common/data-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/useAction';
import type { Payment } from '@/types/rentals.types';
import { formatDateTime, formatMoney } from '@/utils/format';

export interface PaymentsTableProps {
  userId: string;
  payments: Payment[];
  loading?: boolean;
}

export const PaymentsTable = ({ userId, payments, loading }: PaymentsTableProps) => {
  const [retryPayment] = useRetryPaymentMutation();
  const { run, busy } = useAction();

  const columns: Column<Payment>[] = [
    { key: 'id', header: '#', render: (payment) => payment.id },
    { key: 'type', header: 'Type', render: (payment) => payment.transactionType },
    { key: 'amount', header: 'Amount', render: (payment) => formatMoney(payment.amount, payment.currency) },
    { key: 'status', header: 'Status', render: (payment) => <StatusBadge status={payment.status} /> },
    { key: 'failure', header: 'Failure', render: (payment) => payment.failureReason ?? '—' },
    { key: 'date', header: 'Date', render: (payment) => formatDateTime(payment.createdAt) },
    {
      key: 'retry',
      header: '',
      render: (payment) =>
        payment.status === 'Failed' && (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => run(() => retryPayment({ userId, paymentId: payment.id }).unwrap(), `Retry sent for payment #${payment.id}`)}
          >
            Retry
          </Button>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={payments}
      loading={loading}
      rowKey={(payment) => payment.id}
      emptyText="No payments"
    />
  );
};
