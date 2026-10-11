import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useGetDebtsQuery } from '@/api/endpoints/debtsApi';
import { PagedTable, type Column } from '@/components/common/data-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { Select } from '@/components/ui/select';
import { Stack } from '@/components/ui/stack';
import { DEBT_TYPES, PAID_FILTER_OPTIONS } from '@/constants/debts';
import { ROUTES } from '@/constants/paths';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { DebtRow } from '@/types/debts.types';
import { formatDateTime, formatMoney, orDash } from '@/utils/format';

const columns: Column<DebtRow>[] = [
  { key: 'id', header: '#', render: (debt) => debt.id },
  {
    key: 'user',
    header: 'Customer',
    render: (debt) => (
      <Link component={RouterLink} to={ROUTES.CUSTOMER(debt.userId)}>
        {orDash(debt.userName)}
      </Link>
    ),
  },
  { key: 'type', header: 'Type', render: (debt) => debt.type },
  { key: 'desc', header: 'Description', render: (debt) => debt.description },
  { key: 'amount', header: 'Amount', render: (debt) => formatMoney(debt.amount, debt.currency) },
  { key: 'billed', header: 'Billed to', render: (debt) => orDash(debt.billedTo) },
  { key: 'paid', header: 'Status', render: (debt) => <StatusBadge status={debt.isPaid ? 'Paid' : 'Unpaid'} /> },
  { key: 'date', header: 'Created', render: (debt) => formatDateTime(debt.createdAt) },
];

export const AllDebtsTab = () => {
  const [isPaid, setIsPaid] = useState('');
  const [type, setType] = useState('');
  const list = usePagedQuery(useGetDebtsQuery, { isPaid, type });

  return (
    <Card>
      <Stack direction="row" gap="xs" align="center" wrap>
        <Select value={isPaid} onChange={setIsPaid} options={PAID_FILTER_OPTIONS} placeholder="Paid + unpaid" />
        <Select value={type} onChange={setType} options={DEBT_TYPES} placeholder="All types" />
      </Stack>
      <PagedTable list={list} columns={columns} rowKey={(debt) => debt.id} emptyText="No debts" />
    </Card>
  );
};
