import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetCarTrackingQuery } from '@/api/endpoints/carsApi';
import {
  useAddCompensationKmMutation,
  useAddKmPackageMutation,
  useEndRentalMutation,
  useGetKmPackageOptionsQuery,
  useSetRentalStatusMutation,
  useSwitchRentalCarMutation,
} from '@/api/endpoints/rentalsApi';
import { ActionModal } from '@/components/common/action-modal';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { Loader } from '@/components/common/loader';
import { Paragraph } from '@/components/ui/paragraph';
import { RENTAL_STATUSES } from '@/constants/rentals';
import type { RentalStatus } from '@/types/rentals.types';
import { formatMoney } from '@/utils/format';
import {
  changeStatusSchema,
  compensationKmSchema,
  kmPackageSchema,
  switchCarSchema,
  type ChangeStatusFormValues,
  type CompensationKmFormValues,
  type KmPackageFormValues,
  type SwitchCarFormValues,
} from '../rental-detail.schema';

export interface RentalActionModalProps {
  rentalId: number;
  onClose: () => void;
}

export interface ChangeStatusModalProps extends RentalActionModalProps {
  current: RentalStatus;
}

export const EndRentalModal = ({ rentalId, onClose }: RentalActionModalProps) => {
  const [endRental] = useEndRentalMutation();

  return (
    <ActionModal
      title="End rental"
      submitText="End rental"
      successMessage="Rental ended"
      danger
      onSubmit={() => endRental(rentalId).unwrap()}
      onClose={onClose}
    >
      <Paragraph>The rental will be completed, the final payment settled and the car freed. Continue?</Paragraph>
    </ActionModal>
  );
};

export const SwitchCarModal = ({ rentalId, onClose }: RentalActionModalProps) => {
  const { data: cars, isLoading } = useGetCarTrackingQuery();
  const [switchCar] = useSwitchRentalCarMutation();
  const options = (cars ?? [])
    .filter((car) => car.status === 'Available')
    .map((car) => ({ value: car.id, label: `${car.brandName} ${car.modelName} · ${car.plateNumber}` }));

  const form = useForm({
    resolver: yupResolver(switchCarSchema),
    defaultValues: { carId: undefined },
  });

  return (
    <FormModal
      title="Switch car"
      submitText="Switch"
      successMessage="Car switched"
      form={form}
      onSubmit={(values: SwitchCarFormValues) => switchCar({ id: rentalId, carId: values.carId }).unwrap()}
      onClose={onClose}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <FormSelectField name="carId" control={form.control} label="New car" options={options} placeholder="Select an available car" />
      )}
    </FormModal>
  );
};

export const ChangeStatusModal = ({ rentalId, current, onClose }: ChangeStatusModalProps) => {
  const [setStatus] = useSetRentalStatusMutation();

  const form = useForm({
    resolver: yupResolver(changeStatusSchema),
    defaultValues: { status: current },
  });
  const status = useWatch({ control: form.control, name: 'status' });

  return (
    <FormModal
      title="Change status"
      submitText="Save"
      successMessage="Status changed"
      form={form}
      canSubmit={status !== current}
      onSubmit={(values: ChangeStatusFormValues) => setStatus({ id: rentalId, status: values.status }).unwrap()}
      onClose={onClose}
    >
      <Paragraph color="var(--text-muted)">This only sets the status field. To finish a rental properly use "End rental".</Paragraph>
      <FormSelectField name="status" control={form.control} label="Status" options={RENTAL_STATUSES} />
    </FormModal>
  );
};

export const CompensationKmModal = ({ rentalId, onClose }: RentalActionModalProps) => {
  const [addCompensationKm] = useAddCompensationKmMutation();

  const form = useForm({
    resolver: yupResolver(compensationKmSchema),
    defaultValues: { km: undefined, reason: '' },
  });

  return (
    <FormModal
      title="Compensation km"
      submitText="Add"
      successMessage="Compensation km added"
      form={form}
      onSubmit={(values: CompensationKmFormValues) => addCompensationKm({ id: rentalId, km: values.km, reason: values.reason }).unwrap()}
      onClose={onClose}
    >
      <FormTextField name="km" control={form.control} label="Km" type="number" min={1} />
      <FormTextField name="reason" control={form.control} label="Reason" />
    </FormModal>
  );
};

export const KmPackageModal = ({ rentalId, onClose }: RentalActionModalProps) => {
  const { data: options, isLoading } = useGetKmPackageOptionsQuery(rentalId);
  const [addKmPackage] = useAddKmPackageMutation();

  const form = useForm({
    resolver: yupResolver(kmPackageSchema),
    defaultValues: { packageId: undefined },
  });
  const selectedId = useWatch({ control: form.control, name: 'packageId' });
  const selected = options?.find((option) => String(option.id) === String(selectedId));

  const submit = async (values: KmPackageFormValues) => {
    const option = options?.find((item) => item.id === values.packageId);
    return option && addKmPackage({ id: rentalId, option }).unwrap();
  };

  return (
    <FormModal
      title="Add km package"
      submitText="Add package"
      successMessage={selected ? `${selected.km} km package added` : 'Package added'}
      form={form}
      onSubmit={submit}
      onClose={onClose}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <FormSelectField
          name="packageId"
          control={form.control}
          label="Package"
          placeholder="Select a package"
          options={(options ?? []).map((option) => ({ value: option.id, label: `${option.km} km — ${formatMoney(option.price, option.currency)}` }))}
        />
      )}
    </FormModal>
  );
};
