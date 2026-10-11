import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreatePenaltyConfigMutation,
  useCreateServiceFeeMutation,
  useUpdatePenaltyConfigMutation,
  useUpdateServiceFeeMutation,
} from '@/api/endpoints/settingsApi';
import { FormCheckboxField } from '@/components/common/form-checkbox-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type { PenaltyConfig, ServiceFee } from '@/types/settings.types';
import { penaltySchema, serviceFeeSchema, type PenaltyFormValues, type ServiceFeeFormValues } from '../settings.schema';

export const ServiceFeeFormModal = ({ item, onClose }: CrudFormProps<ServiceFee>) => {
  const [createServiceFee] = useCreateServiceFeeMutation();
  const [updateServiceFee] = useUpdateServiceFeeMutation();

  const form = useForm<ServiceFeeFormValues>({
    resolver: yupResolver(serviceFeeSchema),
    defaultValues: {
      name: item?.name ?? '',
      amount: item?.amount,
      isPercentage: item?.isPercentage ?? false,
      isActive: item?.isActive ?? true,
    },
  });
  const isPercentage = useWatch({ control: form.control, name: 'isPercentage' });

  const save = (values: ServiceFeeFormValues) =>
    item ? updateServiceFee({ id: item.id, payload: values }).unwrap() : createServiceFee(values).unwrap();

  return (
    <FormModal
      title={item ? 'Edit service fee' : 'New service fee'}
      submitText="Save"
      successMessage={item ? 'Service fee updated' : 'Service fee created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" />
      <FormTextField
        name="amount"
        control={form.control}
        label={isPercentage ? 'Percent of the rental price' : 'Amount'}
        type="number"
        min={0}
        step="any"
      />
      <FormCheckboxField name="isPercentage" control={form.control} label="Charge as a percentage" />
      <FormCheckboxField name="isActive" control={form.control} label="Active" />
    </FormModal>
  );
};

export const PenaltyFormModal = ({ item, onClose }: CrudFormProps<PenaltyConfig>) => {
  const [createPenaltyConfig] = useCreatePenaltyConfigMutation();
  const [updatePenaltyConfig] = useUpdatePenaltyConfigMutation();

  const form = useForm<PenaltyFormValues>({
    resolver: yupResolver(penaltySchema),
    defaultValues: {
      name: item?.name ?? '',
      amount: item?.amount,
      isActive: item?.isActive ?? true,
    },
  });

  const save = (values: PenaltyFormValues) =>
    item ? updatePenaltyConfig({ id: item.id, payload: values }).unwrap() : createPenaltyConfig(values).unwrap();

  return (
    <FormModal
      title={item ? 'Edit penalty' : 'New penalty'}
      submitText="Save"
      successMessage={item ? 'Penalty updated' : 'Penalty created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" placeholder="Smoking in vehicle" />
      <FormTextField name="amount" control={form.control} label="Amount" type="number" min={0} step="any" />
      <FormCheckboxField name="isActive" control={form.control} label="Active" />
    </FormModal>
  );
};
