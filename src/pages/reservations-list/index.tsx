import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetReservationsQuery } from '@/api/endpoints/reservationsApi';
import { PagedTable, type Column } from '@/components/common/data-table';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Stack } from '@/components/ui/stack';
import { Tabs } from '@/components/ui/tabs';
import { COMMON_MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/paths';
import { RESERVATION_STATUSES, RESERVATION_TABS, type ReservationTab } from '@/constants/reservations';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { ReservationListItem } from '@/types/reservations.types';
import { formatDateTime, formatMoney, orDash } from '@/utils/format';
import { DeliveriesMap } from './components/DeliveriesMap';

const columns: Column<ReservationListItem>[] = [
  { key: 'id', header: '#', render: (r) => r.id },
  { key: 'customer', header: 'Customer', render: (r) => r.customerName },
  { key: 'car', header: 'Car', render: (r) => `${r.carName} · ${r.plateNumber}` },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  { key: 'delivery', header: 'Delivery', render: (r) => (r.isImmediate ? 'Immediate' : formatDateTime(r.scheduledDeliveryDate)) },
  { key: 'driver', header: 'Driver', render: (r) => orDash(r.driverName) },
  { key: 'price', header: 'Price', render: (r) => formatMoney(r.totalPrice) },
];

const ReservationsList = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ReservationTab>(RESERVATION_TABS[0]);
  const [status, setStatus] = useState('');
  const list = usePagedQuery(useGetReservationsQuery, { status });

  return (
    <>
      <PageHeader title="Reservations" />
      <Tabs tabs={RESERVATION_TABS} active={tab} onChange={setTab} />
      {tab === 'List' ? (
        <Card>
          <Stack direction="row" gap="xs" align="center" wrap>
            <Select value={status} onChange={setStatus} options={RESERVATION_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />
          </Stack>
          <PagedTable
            list={list}
            columns={columns}
            rowKey={(r) => r.id}
            onRowClick={(r) => navigate(ROUTES.RESERVATION(r.id))}
            emptyText="No reservations"
          />
        </Card>
      ) : (
        <DeliveriesMap />
      )}
    </>
  );
};

export default ReservationsList;
