import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCreateCampaignMutation,
  useCreateScheduledNotificationMutation,
  useUpdateCampaignMutation,
} from '@/api/endpoints/notificationsApi';
import { FormTextField } from '@/components/common/form-text-field';
import { FormModal } from '@/components/common/form-modal';
import { EMPTY_MESSAGE } from '@/constants/notifications';
import type { CrudFormProps } from '@/hooks/useCrudModals';
import type { Campaign, CampaignPayload, ScheduledNotification, ScheduledPayload } from '@/types/notifications.types';
import { fromDateTimeInput, toDateTimeInput } from '@/utils/format';
import { campaignSchema, scheduledSchema, type CampaignFormValues, type ScheduledFormValues } from '../notifications.schema';
import { MessageFields } from './MessageFields';

const toCampaignPayload = (values: CampaignFormValues): CampaignPayload => ({
  ...values,
  scheduledAt: fromDateTimeInput(values.scheduledAt),
});

const toScheduledPayload = (values: ScheduledFormValues): ScheduledPayload => ({
  ...values,
  scheduledAt: new Date(values.scheduledAt).toISOString(),
});

export const CampaignFormModal = ({ item, onClose }: CrudFormProps<Campaign>) => {
  const [createCampaign] = useCreateCampaignMutation();
  const [updateCampaign] = useUpdateCampaignMutation();

  const form = useForm({
    resolver: yupResolver(campaignSchema),
    defaultValues: {
      title: item?.title ?? EMPTY_MESSAGE.title,
      body: item?.body ?? EMPTY_MESSAGE.body,
      targetAudience: item?.targetAudience ?? EMPTY_MESSAGE.targetAudience,
      scheduledAt: toDateTimeInput(item?.scheduledAt),
    },
  });

  const save = (values: CampaignFormValues) => {
    const payload = toCampaignPayload(values);
    return item ? updateCampaign({ id: item.id, payload }).unwrap() : createCampaign(payload).unwrap();
  };

  return (
    <FormModal
      title={item ? 'Edit campaign' : 'New campaign'}
      submitText="Save"
      successMessage={item ? 'Campaign updated' : 'Campaign created as draft'}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <MessageFields control={form.control} />
      <FormTextField name="scheduledAt" control={form.control} label="Planned send time (optional)" type="datetime-local" />
    </FormModal>
  );
};

export const ScheduledFormModal = ({ onClose }: CrudFormProps<ScheduledNotification>) => {
  const [createScheduledNotification] = useCreateScheduledNotificationMutation();

  const form = useForm({
    resolver: yupResolver(scheduledSchema),
    defaultValues: { ...EMPTY_MESSAGE, scheduledAt: '' },
  });

  return (
    <FormModal
      title="Schedule notification"
      submitText="Schedule"
      successMessage="Notification scheduled"
      form={form}
      onSubmit={(values) => createScheduledNotification(toScheduledPayload(values)).unwrap()}
      onClose={onClose}
    >
      <MessageFields control={form.control} />
      <FormTextField name="scheduledAt" control={form.control} label="Send at" type="datetime-local" />
    </FormModal>
  );
};
