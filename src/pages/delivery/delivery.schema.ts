import * as yup from 'yup';
import { DRIVER_STATUSES } from '@/constants/delivery';
import { FORM_MESSAGES } from '@/constants/messages';
import type { DriverStatus } from '@/types/delivery.types';
import { numberField } from '@/utils/validation';

export const driverSchema = yup.object({
  fullName: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  phoneNumber: yup.string().default(''),
  email: yup.string().email(FORM_MESSAGES.EMAIL).default(''),
  status: yup.mixed<DriverStatus>().oneOf(DRIVER_STATUSES).optional(),
});

export type DriverFormValues = yup.InferType<typeof driverSchema>;

export const zoneSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  centerLat: numberField().required(FORM_MESSAGES.REQUIRED),
  centerLng: numberField().required(FORM_MESSAGES.REQUIRED),
  radiusKm: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  isActive: yup.boolean().required(),
});

export type ZoneFormValues = yup.InferType<typeof zoneSchema>;
