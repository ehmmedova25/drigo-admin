import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { AUDIENCES } from '@/constants/notifications';
import type { Audience } from '@/types/notifications.types';

const messageFields = {
  title: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  body: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  targetAudience: yup.mixed<Audience>().oneOf(AUDIENCES).required(FORM_MESSAGES.REQUIRED),
};

export const broadcastSchema = yup.object(messageFields);

export type BroadcastFormValues = yup.InferType<typeof broadcastSchema>;

export const campaignSchema = yup.object({
  ...messageFields,
  scheduledAt: yup.string().default(''),
});

export type CampaignFormValues = yup.InferType<typeof campaignSchema>;

export const scheduledSchema = yup.object({
  ...messageFields,
  scheduledAt: yup.string().required(FORM_MESSAGES.REQUIRED),
});

export type ScheduledFormValues = yup.InferType<typeof scheduledSchema>;

export const mobileTextSchema = yup.object({
  value: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
});

export type MobileTextFormValues = yup.InferType<typeof mobileTextSchema>;
