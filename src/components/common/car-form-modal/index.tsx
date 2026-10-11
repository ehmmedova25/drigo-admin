import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreateCarMutation,
  useGetAllBrandsQuery,
  useGetBrandColorsQuery,
  useGetBrandModelsQuery,
  useGetCarFuelTypesQuery,
  useUpdateCarMutation,
} from '@/api/endpoints/carsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { DEFAULT_MANUFACTURE_YEAR, TRANSMISSIONS } from '@/constants/cars';
import type { CarDetail, CarPayload } from '@/types/cars.types';
import { carSchema, type CarFormValues } from './car-form-modal.schema';

const toPayload = (values: CarFormValues): CarPayload => ({
  brandId: values.brandId,
  modelId: values.modelId,
  colorId: values.colorId,
  fuelTypeId: values.fuelTypeId,
  plateNumber: values.plateNumber || undefined,
  manufactureYear: values.manufactureYear,
  maxSpeed: values.maxSpeed,
  engineCapacity: values.engineCapacity,
  transmission: values.transmission,
  distance: values.distance,
  chassisNumber: values.chassisNumber || undefined,
});

const toOptions = (items: { id: number; name: string }[] | undefined) => (items ?? []).map((i) => ({ value: i.id, label: i.name }));

export interface CarFormModalProps {
  car?: CarDetail;
  onClose: () => void;
  onSaved?: (id: number) => void;
}

export const CarFormModal = ({ car, onClose, onSaved }: CarFormModalProps) => {
  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();

  const form = useForm({
    resolver: yupResolver(carSchema),
    defaultValues: {
      brandId: car?.brandId,
      modelId: car?.modelId || undefined,
      colorId: car?.colorId || undefined,
      fuelTypeId: car?.fuelTypeId,
      transmission: car?.transmission ?? TRANSMISSIONS[0].value,
      plateNumber: car?.plateNumber ?? '',
      manufactureYear: car?.manufactureYear ?? DEFAULT_MANUFACTURE_YEAR,
      maxSpeed: car?.maxSpeed,
      engineCapacity: car?.engineCapacity,
      distance: car ? car.distance : 0,
      chassisNumber: car?.chassisNumber ?? '',
    },
  });

  const brandId = useWatch({ control: form.control, name: 'brandId' });
  const { data: brands } = useGetAllBrandsQuery();
  const { data: fuelTypes } = useGetCarFuelTypesQuery();
  const { currentData: models } = useGetBrandModelsQuery(brandId ?? '', { skip: !brandId });
  const { currentData: colors } = useGetBrandColorsQuery(brandId ?? '', { skip: !brandId });

  useEffect(
    () =>
      form.subscribe({
        name: 'brandId',
        formState: { values: true },
        callback: () => {
          form.setValue('modelId', undefined);
          form.setValue('colorId', undefined);
        },
      }),
    [form],
  );

  const save = async (values: CarFormValues) => {
    const payload = toPayload(values);
    if (car) {
      await updateCar({ id: car.id, payload }).unwrap();
      onSaved?.(car.id);
      return;
    }
    const created = await createCar(payload).unwrap();
    onSaved?.(created.id);
  };

  return (
    <FormModal
      title={car ? 'Edit car' : 'New car'}
      submitText="Save"
      successMessage={car ? 'Car updated' : 'Car created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormSelectField name="brandId" control={form.control} label="Brand *" options={toOptions(brands)} placeholder="Select brand" />
      <FormSelectField
        name="modelId"
        control={form.control}
        label="Model"
        options={toOptions(models)}
        placeholder="Select model"
        disabled={!brandId}
      />
      <FormSelectField
        name="colorId"
        control={form.control}
        label="Color"
        options={toOptions(colors)}
        placeholder="Select color"
        disabled={!brandId}
      />
      <FormSelectField name="fuelTypeId" control={form.control} label="Fuel type" options={toOptions(fuelTypes)} placeholder="Select fuel type" />
      <FormSelectField name="transmission" control={form.control} label="Transmission" options={TRANSMISSIONS} />
      <FormTextField name="plateNumber" control={form.control} label="Plate number" />
      <FormTextField name="manufactureYear" control={form.control} label="Year" type="number" />
      <FormTextField name="maxSpeed" control={form.control} label="Max speed (km/h)" type="number" />
      <FormTextField name="engineCapacity" control={form.control} label="Engine (L)" type="number" step="0.1" />
      <FormTextField name="distance" control={form.control} label="Odometer (km)" type="number" />
      <FormTextField name="chassisNumber" control={form.control} label="Chassis number (VIN)" />
    </FormModal>
  );
};
