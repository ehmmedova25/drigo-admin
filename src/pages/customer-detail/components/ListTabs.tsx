import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import {
  useAddCustomerBonusMutation,
  useGetCustomerBonusQuery,
  useGetCustomerDevicesQuery,
  useGetCustomerLoginHistoryQuery,
  useGetCustomerPaymentsQuery,
} from '@/api/endpoints/customersApi';
import { useGetCustomerReservationsQuery } from '@/api/endpoints/reservationsApi';
import { useGetRentalsQuery } from '@/api/endpoints/rentalsApi';
import type { Query } from '@/api/types';
import { DataTable, PagedTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { FormTextField } from '@/components/common/form-text-field';
import { Loader } from '@/components/common/loader';
import { PaymentsTable } from '@/components/common/payments-table';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Link } from '@/components/ui/link';
import { Pagination } from '@/components/ui/pagination';
import { Stack } from '@/components/ui/stack';
import { PAGE_SIZE } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { useAction } from '@/hooks/useAction';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { bonusSchema, type BonusFormValues } from '../customer-detail.schema';

const useCustomerPaymentsQuery = ({ userId, ...query }: Query) => useGetCustomerPaymentsQuery({ id: String(userId), query });

const useCustomerReservationsQuery = ({ userId, ...query }: Query) =>
  useGetCustomerReservationsQuery({ userId: String(userId), query });

const useCustomerLoginHistoryQuery = ({ userId, ...query }: Query) =>
  useGetCustomerLoginHistoryQuery({ id: String(userId), query });

export interface CustomerTabProps {
  customerId: string;
}

export const RentalsTab = ({ customerId }: CustomerTabProps) => {
  const list = usePagedQuery(useGetRentalsQuery, { userId: customerId }, PAGE_SIZE.small);

  return (
    <Card>
      <PagedTable
        list={list}
        rowKey={(rental) => rental.id}
        emptyText="No rentals"
        columns={[
          {
            key: 'id',
            header: '#',
            render: (rental) => (
              <Link component={RouterLink} to={ROUTES.RENTAL(rental.id)}>
                {rental.id}
              </Link>
            ),
          },
          {
            key: 'car',
            header: 'Car',
            render: (rental) => `${rental.car?.brand ?? ''} ${rental.car?.model ?? ''} · ${rental.car?.plateNumber ?? ''}`,
          },
          { key: 'status', header: 'Status', render: (rental) => <StatusBadge status={rental.status} /> },
          { key: 'start', header: 'Start', render: (rental) => formatDateTime(rental.startDate) },
          { key: 'paid', header: 'Paid', render: (rental) => formatMoney(rental.totalPaid) },
        ]}
      />
    </Card>
  );
};

export const PaymentsTab = ({ customerId }: CustomerTabProps) => {
  const list = usePagedQuery(useCustomerPaymentsQuery, { userId: customerId }, PAGE_SIZE.small);

  return (
    <Card>
      <PaymentsTable userId={customerId} payments={list.rows} loading={list.loading} />
      <Pagination page={list.page} pageSize={list.pageSize} total={list.total} onChange={list.setPage} />
    </Card>
  );
};

export const BonusTab = ({ customerId }: CustomerTabProps) => {
  const { data, isLoading, error, refetch } = useGetCustomerBonusQuery(customerId);
  const [addBonus] = useAddCustomerBonusMutation();
  const { run } = useAction();

  const form = useForm({
    resolver: yupResolver(bonusSchema),
    defaultValues: { amount: undefined },
  });
  const { isSubmitting } = form.formState;

  if (isLoading) return <Loader />;
  if (error || !data) return <ErrorState error={getErrorMessage(error)} onRetry={refetch} />;

  const add = async (values: BonusFormValues) => {
    if (await run(() => addBonus({ id: customerId, amount: values.amount }).unwrap(), 'Bonus added')) form.reset();
  };

  return (
    <Card title={`Balance: ${formatMoney(data.balance, data.currency)}`}>
      <Form onSubmit={form.handleSubmit(add)}>
        <Stack direction="row" gap="xs" align="end" wrap>
          <FormTextField name="amount" control={form.control} label="Amount" type="number" placeholder="Amount" />
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            Add bonus
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};

export const ReservationsTab = ({ customerId }: CustomerTabProps) => {
  const list = usePagedQuery(useCustomerReservationsQuery, { userId: customerId }, PAGE_SIZE.small);

  return (
    <Card>
      <PagedTable
        list={list}
        rowKey={(reservation) => reservation.id}
        emptyText="No reservations"
        columns={[
          {
            key: 'id',
            header: '#',
            render: (reservation) => (
              <Link component={RouterLink} to={ROUTES.RESERVATION(reservation.id)}>
                {reservation.id}
              </Link>
            ),
          },
          { key: 'car', header: 'Car', render: (reservation) => `${reservation.carName} · ${reservation.plateNumber}` },
          { key: 'status', header: 'Status', render: (reservation) => <StatusBadge status={reservation.status} /> },
          { key: 'delivery', header: 'Delivery', render: (reservation) => formatDateTime(reservation.scheduledDeliveryDate) },
          { key: 'price', header: 'Price', render: (reservation) => formatMoney(reservation.totalPrice) },
        ]}
      />
    </Card>
  );
};

export const DevicesTab = ({ customerId }: CustomerTabProps) => {
  const { rows, loading, error, reload } = toListState(useGetCustomerDevicesQuery(customerId));

  return (
    <Card>
      <DataTable
        rows={rows}
        loading={loading}
        error={error}
        onRetry={reload}
        rowKey={(device) => device.deviceId}
        columns={[
          { key: 'model', header: 'Model', render: (device) => device.model },
          { key: 'platform', header: 'Platform', render: (device) => device.platform },
          { key: 'app', header: 'App version', render: (device) => device.appVersion },
          { key: 'seen', header: 'Last seen', render: (device) => formatDateTime(device.lastSeenAt) },
          { key: 'current', header: 'Current', render: (device) => (device.isCurrent ? 'Yes' : '') },
        ]}
      />
    </Card>
  );
};

export const LoginHistoryTab = ({ customerId }: CustomerTabProps) => {
  const list = usePagedQuery(useCustomerLoginHistoryQuery, { userId: customerId }, PAGE_SIZE.small);

  return (
    <Card>
      <PagedTable
        list={list}
        rowKey={(entry) => entry.id}
        columns={[
          { key: 'at', header: 'At', render: (entry) => formatDateTime(entry.at) },
          { key: 'ip', header: 'IP', render: (entry) => entry.ip },
          { key: 'device', header: 'Device', render: (entry) => `${entry.device} (${entry.platform})` },
          { key: 'city', header: 'City', render: (entry) => entry.city },
          { key: 'result', header: 'Result', render: (entry) => <StatusBadge status={entry.success ? 'Succeeded' : 'Failed'} /> },
        ]}
      />
    </Card>
  );
};
