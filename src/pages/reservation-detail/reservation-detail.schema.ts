import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { idField } from '@/utils/validation';

export const assignDriverSchema = yup.object({
  driverId: idField().required(FORM_MESSAGES.REQUIRED),
});

export type AssignDriverFormValues = yup.InferType<typeof assignDriverSchema>;

export const cancelReservationSchema = yup.object({
  reason: yup.string().trim().default(''),
});

export type CancelReservationFormValues = yup.InferType<typeof cancelReservationSchema>;
