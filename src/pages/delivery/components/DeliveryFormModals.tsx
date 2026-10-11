import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateDriverMutation, useCreateZoneMutation, useUpdateDriverMutation, useUpdateZoneMutation } from '@/api/endpoints/deliveryApi';
import { FormCheckboxField } from '@/components/common/form-checkbox-field';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { DEFAULT_ZONE, DRIVER_STATUSES } from '@/constants/delivery';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type { Driver, DriverPayload, Zone } from '@/types/delivery.types';
import { driverSchema, zoneSchema, type DriverFormValues, type ZoneFormValues } from '../delivery.schema';

const toDriverPayload = (values: DriverFormValues): DriverPayload => ({
  fullName: values.fullName,
  phoneNumber: values.phoneNumber,
  email: values.email,
});

export const DriverFormModal = ({ item: driver, onClose }: CrudFormProps<Driver>) => {
  const [createDriver] = useCreateDriverMutation();
  const [updateDriver] = useUpdateDriverMutation();

  const form = useForm({
    resolver: yupResolver(driverSchema),
    defaultValues: {
      fullName: driver?.fullName ?? '',
      phoneNumber: driver?.phoneNumber ?? '',
      email: driver?.email ?? '',
      status: driver?.status,
    },
  });

  const save = (values: DriverFormValues) => {
    const payload = toDriverPayload(values);
    return driver
      ? updateDriver({ id: driver.id, payload: { ...payload, status: values.status } }).unwrap()
      : createDriver(payload).unwrap();
  };

  return (
    <FormModal
      title={driver ? 'Edit driver' : 'New driver'}
      submitText="Save"
      successMessage={driver ? 'Driver updated' : 'Driver created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="fullName" control={form.control} label="Full name" />
      <FormTextField name="phoneNumber" control={form.control} label="Phone" />
      <FormTextField name="email" control={form.control} label="Email" type="email" />
      {driver && <FormSelectField name="status" control={form.control} label="Status" options={DRIVER_STATUSES} />}
    </FormModal>
  );
};

export const ZoneFormModal = ({ item: zone, onClose }: CrudFormProps<Zone>) => {
  const [createZone] = useCreateZoneMutation();
  const [updateZone] = useUpdateZoneMutation();

  const form = useForm({
    resolver: yupResolver(zoneSchema),
    defaultValues: {
      name: zone?.name ?? '',
      centerLat: zone?.centerLat ?? DEFAULT_ZONE.centerLat,
      centerLng: zone?.centerLng ?? DEFAULT_ZONE.centerLng,
      radiusKm: zone?.radiusKm ?? DEFAULT_ZONE.radiusKm,
      isActive: zone?.isActive ?? true,
    },
  });

  const save = (values: ZoneFormValues) => (zone ? updateZone({ id: zone.id, payload: values }).unwrap() : createZone(values).unwrap());

  return (
    <FormModal
      title={zone ? 'Edit zone' : 'New zone'}
      submitText="Save"
      successMessage={zone ? 'Zone updated' : 'Zone created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" />
      <FormTextField name="centerLat" control={form.control} label="Center latitude" type="number" step="any" />
      <FormTextField name="centerLng" control={form.control} label="Center longitude" type="number" step="any" />
      <FormTextField name="radiusKm" control={form.control} label="Radius (km)" type="number" min={0} />
      <FormCheckboxField name="isActive" control={form.control} label="Active" />
    </FormModal>
  );
};
