import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useGetSubscriptionBookingsQuery, useSetSubscriptionBookingStatusMutation } from '@/api/endpoints/subscriptionsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { StatusChangeModal } from '@/components/common/status-change-modal';
import { Link } from '@/components/ui/link';
import { EMPTY_VALUE } from '@/constants/config';
import { ROUTES } from '@/constants/paths';
import { BOOKING_STATUSES } from '@/constants/subscriptions';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { SubscriptionBooking } from '@/types/subscriptions.types';
import { formatDate, formatMoney } from '@/utils/format';
import { AssignCarModal } from './SubscriptionModals';

type BookingModal = { kind: 'status' | 'car'; booking: SubscriptionBooking } | null;

export const BookingsTab = () => {
  const list = usePagedQuery(useGetSubscriptionBookingsQuery);
  const [setBookingStatus] = useSetSubscriptionBookingStatusMutation();
  const [modal, setModal] = useState<BookingModal>(null);
  const close = () => setModal(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="booking"
        rowKey={(booking) => booking.id}
        nameOf={(booking) => `#${booking.id}`}
        columns={[
          { key: 'id', header: '#', render: (booking) => booking.id },
          {
            key: 'customer',
            header: 'Customer',
            render: (booking) => (
              <Link component={RouterLink} to={ROUTES.CUSTOMER(booking.userId)}>
                {booking.customerName}
              </Link>
            ),
          },
          { key: 'model', header: 'Model', render: (booking) => booking.modelName },
          {
            key: 'car',
            header: 'Car',
            render: (booking) =>
              booking.carId ? (
                <Link component={RouterLink} to={ROUTES.CAR(booking.carId)}>
                  #{booking.carId}
                </Link>
              ) : (
                EMPTY_VALUE
              ),
          },
          { key: 'months', header: 'Months', render: (booking) => booking.months },
          { key: 'price', header: 'Monthly', render: (booking) => formatMoney(booking.monthlyPrice, booking.currency) },
          { key: 'start', header: 'Start', render: (booking) => formatDate(booking.startDate) },
          { key: 'status', header: 'Status', render: (booking) => <StatusBadge status={booking.status} /> },
        ]}
        rowActions={(booking) => [
          { label: 'Assign car', onClick: () => setModal({ kind: 'car', booking }) },
          { label: 'Status', onClick: () => setModal({ kind: 'status', booking }) },
        ]}
      />
      {modal?.kind === 'status' && (
        <StatusChangeModal
          title={`Booking #${modal.booking.id} status`}
          current={modal.booking.status}
          options={BOOKING_STATUSES}
          onSubmit={(status) => setBookingStatus({ id: modal.booking.id, status }).unwrap()}
          onClose={close}
        />
      )}
      {modal?.kind === 'car' && <AssignCarModal item={modal.booking} onClose={close} />}
    </>
  );
};
