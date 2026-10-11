import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useGetDebtorsQuery } from '@/api/endpoints/debtsApi';
import { PagedTable, type Column } from '@/components/common/data-table';
import { DebtPanel } from '@/components/common/debt-panel';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import { Modal } from '@/components/ui/modal';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { ROUTES } from '@/constants/paths';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { Debtor } from '@/types/debts.types';
import { formatMoney } from '@/utils/format';

const columns: Column<Debtor>[] = [
  { key: 'name', header: 'Customer', render: (debtor) => debtor.fullName },
  { key: 'phone', header: 'Phone', render: (debtor) => debtor.phoneNumber },
  {
    key: 'debt',
    header: 'Unpaid debt',
    render: (debtor) => (
      <Span color="var(--text-primary)" weight="500">
        {formatMoney(debtor.totalDebt)}
      </Span>
    ),
  },
  { key: 'blocked', header: 'Blocked', render: (debtor) => (debtor.isBlocked ? 'Yes' : '') },
  { key: 'open', header: '', render: () => <Span color="var(--text-muted)">Manage</Span> },
];

export const DebtorsTab = () => {
  const [minDebt, setMinDebt] = useState('');
  const list = usePagedQuery(useGetDebtorsQuery, { minDebt: useDebounce(minDebt) });
  const [open, setOpen] = useState<Debtor | null>(null);

  return (
    <Card>
      <Stack direction="row" gap="xs" align="center" wrap>
        <Input type="number" placeholder="Min debt" value={minDebt} onChange={(event) => setMinDebt(event.target.value)} />
      </Stack>
      <PagedTable list={list} columns={columns} rowKey={(debtor) => debtor.id} onRowClick={setOpen} emptyText="No customers with debt" />
      {open && (
        <Modal wide title={`Debts: ${open.fullName}`} onClose={() => setOpen(null)}>
          <Link component={RouterLink} to={ROUTES.CUSTOMER(open.id)}>
            Open customer profile
          </Link>
          <DebtPanel userId={open.id} />
        </Modal>
      )}
    </Card>
  );
};
