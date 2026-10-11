import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreateDiscountMutation,
  useCreatePromoCodeMutation,
  useCreatePromotionMutation,
  useCreateStoryMutation,
  useUpdateDiscountMutation,
  useUpdatePromoCodeMutation,
  useUpdatePromotionMutation,
  useUpdateStoryMutation,
} from '@/api/endpoints/promotionsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextareaField } from '@/components/common/form-textarea-field';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import {
  DISCOUNT_AUDIENCES,
  DISCOUNT_SCOPES,
  DISCOUNT_TYPES,
  PROMO_DISCOUNT_TYPES,
  PROMOTION_ACTIONS,
  PROMOTION_FREQUENCIES,
  STORY_AUDIENCES,
  STORY_STATUSES,
} from '@/constants/promotions';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type {
  Discount,
  DiscountPayload,
  PromoCode,
  PromoCodePayload,
  Promotion,
  PromotionPayload,
  Story,
} from '@/types/promotions.types';
import { fromDateTimeInput, toDateTimeInput } from '@/utils/format';
import {
  discountSchema,
  promoCodeSchema,
  promotionSchema,
  storySchema,
  type DiscountFormValues,
  type PromoCodeFormValues,
  type PromotionFormValues,
  type StoryFormValues,
} from '../promotions.schema';

const now = () => new Date().toISOString();

const toPromotionPayload = (values: PromotionFormValues): PromotionPayload => ({
  ...values,
  startDate: fromDateTimeInput(values.startDate) ?? now(),
  endDate: fromDateTimeInput(values.endDate),
});

const toDiscountPayload = (values: DiscountFormValues): DiscountPayload => ({
  ...values,
  name: values.name.toUpperCase(),
  usageLimit: values.usageLimit ?? null,
  startDate: fromDateTimeInput(values.startDate) ?? now(),
  endDate: fromDateTimeInput(values.endDate),
});

const toPromoCodePayload = (values: PromoCodeFormValues): PromoCodePayload => ({
  ...values,
  code: values.code.toUpperCase(),
  maxRedemptions: values.maxRedemptions ?? null,
  expiresAt: fromDateTimeInput(values.expiresAt),
});

export const PromotionFormModal = ({ item, onClose }: CrudFormProps<Promotion>) => {
  const [createPromotion] = useCreatePromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();

  const form = useForm({
    resolver: yupResolver(promotionSchema),
    defaultValues: {
      title: item?.title ?? '',
      description: item?.description ?? '',
      actionType: item?.actionType ?? PROMOTION_ACTIONS[0],
      frequency: item?.frequency ?? PROMOTION_FREQUENCIES[0],
      startDate: toDateTimeInput(item?.startDate ?? now()),
      endDate: toDateTimeInput(item?.endDate),
    },
  });

  const save = (values: PromotionFormValues) => {
    const payload = toPromotionPayload(values);
    return item ? updatePromotion({ id: item.id, payload }).unwrap() : createPromotion(payload).unwrap();
  };

  return (
    <FormModal
      title={item ? 'Edit promotion' : 'New promotion'}
      submitText="Save"
      successMessage={item ? 'Promotion updated' : 'Promotion created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="title" control={form.control} label="Title" />
      <FormTextareaField name="description" control={form.control} label="Description" />
      <FormSelectField name="actionType" control={form.control} label="On tap" options={PROMOTION_ACTIONS} />
      <FormSelectField name="frequency" control={form.control} label="Show" options={PROMOTION_FREQUENCIES} />
      <FormTextField name="startDate" control={form.control} label="Starts" type="datetime-local" />
      <FormTextField name="endDate" control={form.control} label="Ends (optional)" type="datetime-local" />
    </FormModal>
  );
};

export const DiscountFormModal = ({ item, onClose }: CrudFormProps<Discount>) => {
  const [createDiscount] = useCreateDiscountMutation();
  const [updateDiscount] = useUpdateDiscountMutation();

  const form = useForm({
    resolver: yupResolver(discountSchema),
    defaultValues: {
      name: item?.name ?? '',
      type: item?.type ?? DISCOUNT_TYPES[0],
      value: item?.value,
      targetAudience: item?.targetAudience ?? DISCOUNT_AUDIENCES[0],
      scope: item?.scope ?? DISCOUNT_SCOPES[0],
      usageLimit: item?.usageLimit ?? undefined,
      startDate: toDateTimeInput(item?.startDate ?? now()),
      endDate: toDateTimeInput(item?.endDate),
    },
  });

  const save = (values: DiscountFormValues) => {
    const payload = toDiscountPayload(values);
    return item ? updateDiscount({ id: item.id, payload }).unwrap() : createDiscount(payload).unwrap();
  };

  return (
    <FormModal
      title={item ? 'Edit discount' : 'New discount'}
      submitText="Save"
      successMessage={item ? 'Discount updated' : 'Discount created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="name" control={form.control} label="Name" placeholder="SUMMER25" />
      <FormSelectField name="type" control={form.control} label="Type" options={DISCOUNT_TYPES} />
      <FormTextField name="value" control={form.control} label="Value" type="number" min={0} step="any" />
      <FormSelectField name="targetAudience" control={form.control} label="Audience" options={DISCOUNT_AUDIENCES} />
      <FormSelectField name="scope" control={form.control} label="Applies to" options={DISCOUNT_SCOPES} />
      <FormTextField name="usageLimit" control={form.control} label="Usage limit (empty = unlimited)" type="number" min={1} />
      <FormTextField name="startDate" control={form.control} label="Starts" type="datetime-local" />
      <FormTextField name="endDate" control={form.control} label="Ends (optional)" type="datetime-local" />
    </FormModal>
  );
};

export const PromoCodeFormModal = ({ item, onClose }: CrudFormProps<PromoCode>) => {
  const [createPromoCode] = useCreatePromoCodeMutation();
  const [updatePromoCode] = useUpdatePromoCodeMutation();

  const form = useForm({
    resolver: yupResolver(promoCodeSchema),
    defaultValues: {
      code: item?.code ?? '',
      discountType: item?.discountType ?? PROMO_DISCOUNT_TYPES[0],
      value: item?.value,
      maxRedemptions: item?.maxRedemptions ?? undefined,
      expiresAt: toDateTimeInput(item?.expiresAt),
    },
  });

  const save = (values: PromoCodeFormValues) => {
    const payload = toPromoCodePayload(values);
    return item ? updatePromoCode({ id: item.id, payload }).unwrap() : createPromoCode(payload).unwrap();
  };

  return (
    <FormModal
      title={item ? 'Edit promo code' : 'New promo code'}
      submitText="Save"
      successMessage={item ? 'Promo code updated' : 'Promo code created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="code" control={form.control} label="Code" placeholder="WELCOME10" />
      <FormSelectField name="discountType" control={form.control} label="Type" options={PROMO_DISCOUNT_TYPES} />
      <FormTextField name="value" control={form.control} label="Value" type="number" min={0} step="any" />
      <FormTextField name="maxRedemptions" control={form.control} label="Max redemptions (empty = unlimited)" type="number" min={1} />
      <FormTextField name="expiresAt" control={form.control} label="Expires (optional)" type="datetime-local" />
    </FormModal>
  );
};

export const StoryFormModal = ({ item, onClose }: CrudFormProps<Story>) => {
  const [createStory] = useCreateStoryMutation();
  const [updateStory] = useUpdateStoryMutation();

  const form = useForm({
    resolver: yupResolver(storySchema),
    defaultValues: {
      title: item?.title ?? '',
      status: item?.status ?? STORY_STATUSES[0],
      targetAudience: item?.targetAudience ?? STORY_AUDIENCES[0],
    },
  });

  const save = (values: StoryFormValues) => (item ? updateStory({ id: item.id, payload: values }).unwrap() : createStory(values).unwrap());

  return (
    <FormModal
      title={item ? 'Edit story' : 'New story'}
      submitText="Save"
      successMessage={item ? 'Story updated' : 'Story created'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <FormTextField name="title" control={form.control} label="Title" />
      <FormSelectField name="status" control={form.control} label="Status" options={STORY_STATUSES} />
      <FormSelectField name="targetAudience" control={form.control} label="Audience" options={STORY_AUDIENCES} />
    </FormModal>
  );
};
