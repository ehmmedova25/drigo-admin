import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetAllDriversQuery } from '@/api/endpoints/deliveryApi';
import { useAssignReservationDriverMutation, useCancelReservationMutation } from '@/api/endpoints/reservationsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { Loader } from '@/components/common/loader';
import { Paragraph } from '@/components/ui/paragraph';
import {
  assignDriverSchema,
  cancelReservationSchema,
  type AssignDriverFormValues,
  type CancelReservationFormValues,
} from '../reservation-detail.schema';

export interface ReservationActionModalProps {
  reservationId: number;
  onClose: () => void;
}

export const AssignDriverModal = ({ reservationId, onClose }: ReservationActionModalProps) => {
  const { data: drivers, isLoading } = useGetAllDriversQuery();
  const [assignReservationDriver] = useAssignReservationDriverMutation();
  const options = (drivers ?? [])
    .filter((d) => d.isActive)
    .sort((a, b) => Number(a.status === 'Offline') - Number(b.status === 'Offline'))
    .map((d) => ({ value: d.id, label: `${d.fullName} · ${d.status} · ${d.activeDeliveries} active · rating ${d.rating}` }));

  const form = useForm({ resolver: yupResolver(assignDriverSchema), defaultValues: { driverId: undefined } });

  const assign = (values: AssignDriverFormValues) => assignReservationDriver({ id: reservationId, driverId: values.driverId }).unwrap();

  return (
    <FormModal title="Assign driver" submitText="Assign" successMessage="Driver assigned" form={form} onSubmit={assign} onClose={onClose}>
      {isLoading ? (
        <Loader />
      ) : (
        <FormSelectField name="driverId" control={form.control} label="Driver" options={options} placeholder="Select driver" />
      )}
    </FormModal>
  );
};

export const CancelReservationModal = ({ reservationId, onClose }: ReservationActionModalProps) => {
  const [cancelReservation] = useCancelReservationMutation();
  const form = useForm({ resolver: yupResolver(cancelReservationSchema), defaultValues: { reason: '' } });

  const cancel = (values: CancelReservationFormValues) => cancelReservation({ id: reservationId, reason: values.reason }).unwrap();

  return (
    <FormModal
      title="Cancel reservation"
      submitText="Cancel reservation"
      successMessage="Reservation cancelled"
      danger
      form={form}
      onSubmit={cancel}
      onClose={onClose}
    >
      <Paragraph>The reservation becomes Cancelled and the assigned driver is released.</Paragraph>
      <FormTextField name="reason" control={form.control} label="Reason" />
    </FormModal>
  );
};
