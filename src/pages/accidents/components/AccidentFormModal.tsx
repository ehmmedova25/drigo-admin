import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateAccidentMutation, useUpdateAccidentMutation } from '@/api/endpoints/accidentsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextareaField } from '@/components/common/form-textarea-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { ACCIDENT_STATUSES, FAULT_PARTIES } from '@/constants/accidents';
import type { Accident, AccidentPayload } from '@/types/accidents.types';
import { accidentSchema, type AccidentFormValues } from '../accidents.schema';

export interface AccidentFormModalProps {
  accident: Accident | null;
  onClose: () => void;
}

const toPayload = (values: AccidentFormValues): AccidentPayload => ({
  ...values,
  carId: values.carId ?? null,
  rentalId: values.rentalId ?? null,
});

export const AccidentFormModal = ({ accident, onClose }: AccidentFormModalProps) => {
  const [createAccident] = useCreateAccidentMutation();
  const [updateAccident] = useUpdateAccidentMutation();

  const form = useForm({
    resolver: yupResolver(accidentSchema),
    defaultValues: {
      carId: accident?.carId ?? undefined,
      rentalId: accident?.rentalId ?? undefined,
      faultParty: accident?.faultParty ?? 'Unknown',
      status: accident?.status ?? ACCIDENT_STATUSES[0],
      estimatedCost: accident?.estimatedCost,
      location: accident?.location ?? '',
      description: accident?.description ?? '',
    },
  });

  const save = (values: AccidentFormValues) => {
    const payload = toPayload(values);
    return accident ? updateAccident({ id: accident.id, payload }).unwrap() : createAccident(payload).unwrap();
  };

  return (
    <FormModal
      title={accident ? `Accident #${accident.id}` : 'Report accident'}
      submitText="Save"
      successMessage={accident ? 'Accident updated' : 'Accident reported'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="carId" control={form.control} label="Car ID" type="number" min={1} />
      <FormTextField name="rentalId" control={form.control} label="Rental ID" type="number" min={1} />
      <FormSelectField name="faultParty" control={form.control} label="Fault party" options={FAULT_PARTIES} />
      <FormSelectField name="status" control={form.control} label="Status" options={ACCIDENT_STATUSES} />
      <FormTextField name="estimatedCost" control={form.control} label="Estimated cost" type="number" min={0} />
      <FormTextField name="location" control={form.control} label="Location" />
      <FormTextareaField name="description" control={form.control} label="Description" rows={3} />
    </FormModal>
  );
};
