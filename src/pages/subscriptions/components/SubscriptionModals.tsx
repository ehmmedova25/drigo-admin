import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useAssignSubscriptionBookingCarMutation,
  useGetSubscriptionAssignableCarsQuery,
  useSaveSubscriptionPlanMutation,
} from '@/api/endpoints/subscriptionsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { Alert } from '@/components/ui/alert';
import { DEFAULT_PLAN } from '@/constants/subscriptions';
import type { ModelWithPlan, SubscriptionBooking } from '@/types/subscriptions.types';
import { getErrorMessage } from '@/utils/apiError';
import { assignCarSchema, planSchema, type AssignCarFormValues, type PlanFormValues } from '../subscriptions.schema';

export interface SubscriptionModalProps<T> {
  item: T;
  onClose: () => void;
}

export const PlanModal = ({ item: model, onClose }: SubscriptionModalProps<ModelWithPlan>) => {
  const plan = model.plan;
  const [saveSubscriptionPlan] = useSaveSubscriptionPlanMutation();

  const form = useForm<PlanFormValues>({
    resolver: yupResolver(planSchema),
    defaultValues: {
      monthlyPrice: plan?.monthlyPrice,
      includedKm: plan?.includedKm ?? DEFAULT_PLAN.includedKm,
      minMonths: plan?.minMonths ?? DEFAULT_PLAN.minMonths,
    },
  });

  const save = (values: PlanFormValues) => saveSubscriptionPlan({ modelId: model.modelId, payload: values }).unwrap();

  return (
    <FormModal
      title={`${plan ? 'Edit' : 'Create'} plan: ${model.modelName}`}
      submitText="Save"
      successMessage="Subscription plan saved"
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="monthlyPrice" control={form.control} label="Monthly price" type="number" min={0} />
      <FormTextField name="includedKm" control={form.control} label="Included km per month" type="number" min={0} />
      <FormTextField name="minMonths" control={form.control} label="Minimum months" type="number" min={1} />
    </FormModal>
  );
};

export const AssignCarModal = ({ item: booking, onClose }: SubscriptionModalProps<SubscriptionBooking>) => {
  const { data: cars, error } = useGetSubscriptionAssignableCarsQuery(booking.modelId);
  const [assignCar] = useAssignSubscriptionBookingCarMutation();

  const form = useForm({ resolver: yupResolver(assignCarSchema), defaultValues: { carId: undefined } });

  const save = (values: AssignCarFormValues) => assignCar({ id: booking.id, carId: values.carId }).unwrap();

  return (
    <FormModal
      title={`Assign a ${booking.modelName} to booking #${booking.id}`}
      submitText="Assign"
      successMessage="Car assigned"
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      {error && <Alert variant="error">{getErrorMessage(error)}</Alert>}
      {cars && cars.length === 0 && <Alert variant="warning">No free {booking.modelName} cars right now.</Alert>}
      <FormSelectField
        name="carId"
        control={form.control}
        label="Car"
        disabled={!cars?.length}
        placeholder={cars ? 'Select a car' : 'Loading...'}
        options={(cars ?? []).map((car) => ({ value: car.id, label: `${car.plateNumber} · ${car.brandName} ${car.modelName}` }))}
      />
    </FormModal>
  );
};
