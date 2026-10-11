import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetRentalsQuery } from '@/api/endpoints/rentalsApi';
import { PagedTable, type Column } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Stack } from '@/components/ui/stack';
import { EMPTY_VALUE } from '@/constants/config';
import { COMMON_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/paths';
import { RENTAL_SORT_OPTIONS, RENTAL_STATUSES } from '@/constants/rentals';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { RentalListItem } from '@/types/rentals.types';
import { formatDateTime, formatMoney, orDash } from '@/utils/format';
import { SORT_ORDER_OPTIONS } from '@/utils/sorting';

const columns: Column<RentalListItem>[] = [
  { key: 'id', header: '#', render: (rental) => rental.id },
  { key: 'customer', header: 'Customer', render: (rental) => orDash(rental.user?.fullName) },
  {
    key: 'car',
    header: 'Car',
    render: (rental) => (rental.car ? `${rental.car.brand} ${rental.car.model} · ${rental.car.plateNumber}` : EMPTY_VALUE),
  },
  { key: 'status', header: 'Status', render: (rental) => <StatusBadge status={rental.status} /> },
  { key: 'start', header: 'Start', render: (rental) => formatDateTime(rental.startDate) },
  { key: 'end', header: 'End', render: (rental) => formatDateTime(rental.endDate) },
  { key: 'tariff', header: 'Duration', render: (rental) => orDash(rental.tariffName) },
  { key: 'paid', header: 'Paid', render: (rental) => formatMoney(rental.totalPaid) },
  {
    key: 'debt',
    header: 'Customer debt',
    render: (rental) => (rental.userTotalDebt > 0 ? formatMoney(rental.userTotalDebt) : EMPTY_VALUE),
  },
];

const RentalsList = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState(RENTAL_SORT_OPTIONS[0].value);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER_OPTIONS[0].value);
  const list = usePagedQuery(useGetRentalsQuery, { status, sortBy, sortOrder });

  return (
    <>
      <PageHeader title="Rentals" actions={<Button onClick={list.reload}>Refresh</Button>} />
      <Card>
        <Stack direction="row" gap="xs" wrap>
          <Select value={status} onChange={setStatus} options={RENTAL_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />
          <Select value={sortBy} onChange={setSortBy} options={RENTAL_SORT_OPTIONS} />
          <Select value={sortOrder} onChange={setSortOrder} options={SORT_ORDER_OPTIONS} />
        </Stack>
        <PagedTable
          list={list}
          columns={columns}
          rowKey={(rental) => rental.id}
          onRowClick={(rental) => navigate(ROUTES.RENTAL(rental.id))}
          emptyText="No rentals match this filter"
        />
      </Card>
    </>
  );
};

export default RentalsList;
