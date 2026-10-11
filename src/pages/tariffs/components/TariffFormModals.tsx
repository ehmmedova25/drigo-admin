import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreateOverageChargeMutation,
  useCreateTariffPackageMutation,
  useCreateTariffPlanMutation,
  useCreateTariffTemplateMutation,
  useUpdateOverageChargeMutation,
  useUpdateTariffPackageMutation,
  useUpdateTariffPlanMutation,
  useUpdateTariffTemplateMutation,
} from '@/api/endpoints/tariffsApi';
import { FormCheckboxField } from '@/components/common/form-checkbox-field';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextareaField } from '@/components/common/form-textarea-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { DEFAULT_PACKAGE, TIME_UNITS } from '@/constants/tariffs';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type { OverageCharge, TariffPackage, TariffPlan, TariffTemplate } from '@/types/tariffs.types';
import {
  overageSchema,
  packageSchema,
  planSchema,
  templateSchema,
  type OverageFormValues,
  type PackageFormValues,
  type PlanFormValues,
  type TemplateFormValues,
} from '../tariffs.schema';

export const PackageFormModal = ({ item, onClose }: CrudFormProps<TariffPackage>) => {
  const [createTariffPackage] = useCreateTariffPackageMutation();
  const [updateTariffPackage] = useUpdateTariffPackageMutation();

  const form = useForm<PackageFormValues>({
    resolver: yupResolver(packageSchema),
    defaultValues: {
      unitCount: item?.unitCount ?? DEFAULT_PACKAGE.unitCount,
      timeUnit: item?.timeUnit ?? DEFAULT_PACKAGE.timeUnit,
      price: item?.price,
      isActive: item?.isActive ?? true,
    },
  });

  const save = (values: PackageFormValues) =>
    item ? updateTariffPackage({ id: item.id, payload: values }).unwrap() : createTariffPackage(values).unwrap();

  return (
    <FormModal
      title={item ? 'Edit package' : 'New package'}
      submitText="Save"
      successMessage={item ? 'Package updated' : 'Package created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="unitCount" control={form.control} label="Duration" type="number" min={1} />
      <FormSelectField name="timeUnit" control={form.control} label="Unit" options={TIME_UNITS} />
      <FormTextField name="price" control={form.control} label="Price" type="number" min={0} step="any" />
      <FormCheckboxField name="isActive" control={form.control} label="Active" />
    </FormModal>
  );
};

export const PlanFormModal = ({ item, onClose }: CrudFormProps<TariffPlan>) => {
  const [createTariffPlan] = useCreateTariffPlanMutation();
  const [updateTariffPlan] = useUpdateTariffPlanMutation();

  const form = useForm({
    resolver: yupResolver(planSchema),
    defaultValues: { name: item?.name ?? '', description: item?.description ?? '', isActive: item?.isActive ?? true },
  });

  const save = (values: PlanFormValues) =>
    item ? updateTariffPlan({ id: item.id, payload: values }).unwrap() : createTariffPlan(values).unwrap();

  return (
    <FormModal
      title={item ? 'Edit plan' : 'New plan'}
      submitText="Save"
      successMessage={item ? 'Plan updated' : 'Plan created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" />
      <FormTextareaField name="description" control={form.control} label="Description" />
      <FormCheckboxField name="isActive" control={form.control} label="Active" />
    </FormModal>
  );
};

export const TemplateFormModal = ({ item, onClose }: CrudFormProps<TariffTemplate>) => {
  const [createTariffTemplate] = useCreateTariffTemplateMutation();
  const [updateTariffTemplate] = useUpdateTariffTemplateMutation();

  const form = useForm({
    resolver: yupResolver(templateSchema),
    defaultValues: { name: item?.name ?? '', description: item?.description ?? '' },
  });

  const save = (values: TemplateFormValues) =>
    item ? updateTariffTemplate({ id: item.id, payload: values }).unwrap() : createTariffTemplate(values).unwrap();

  return (
    <FormModal
      title={item ? 'Edit template' : 'New template'}
      submitText="Save"
      successMessage={item ? 'Template updated' : 'Template created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" />
      <FormTextareaField name="description" control={form.control} label="Description" />
    </FormModal>
  );
};

export const OverageFormModal = ({ item, onClose }: CrudFormProps<OverageCharge>) => {
  const [createOverageCharge] = useCreateOverageChargeMutation();
  const [updateOverageCharge] = useUpdateOverageChargeMutation();

  const form = useForm<OverageFormValues>({
    resolver: yupResolver(overageSchema),
    defaultValues: {
      name: item?.name ?? '',
      pricePerKm: item?.pricePerKm,
      thresholdKm: item?.thresholdKm ?? 0,
      isActive: item?.isActive ?? true,
    },
  });

  const save = (values: OverageFormValues) =>
    item ? updateOverageCharge({ id: item.id, payload: values }).unwrap() : createOverageCharge(values).unwrap();

  return (
    <FormModal
      title={item ? 'Edit overage charge' : 'New overage charge'}
      submitText="Save"
      successMessage={item ? 'Overage charge updated' : 'Overage charge created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" />
      <FormTextField name="pricePerKm" control={form.control} label="Price per km" type="number" min={0} step="any" />
      <FormTextField name="thresholdKm" control={form.control} label="Free km before charging" type="number" min={0} />
      <FormCheckboxField name="isActive" control={form.control} label="Active" />
    </FormModal>
  );
};
