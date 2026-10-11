import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { RENTAL_STATUSES } from '@/constants/rentals';
import type { RentalStatus } from '@/types/rentals.types';
import { idField, numberField } from '@/utils/validation';

export const switchCarSchema = yup.object({
  carId: idField().required(FORM_MESSAGES.REQUIRED),
});

export type SwitchCarFormValues = yup.InferType<typeof switchCarSchema>;

export const changeStatusSchema = yup.object({
  status: yup.mixed<RentalStatus>().oneOf(RENTAL_STATUSES).required(FORM_MESSAGES.REQUIRED),
});

export type ChangeStatusFormValues = yup.InferType<typeof changeStatusSchema>;

export const compensationKmSchema = yup.object({
  km: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  reason: yup.string().default(''),
});

export type CompensationKmFormValues = yup.InferType<typeof compensationKmSchema>;

export const kmPackageSchema = yup.object({
  packageId: idField().required(FORM_MESSAGES.REQUIRED),
});

export type KmPackageFormValues = yup.InferType<typeof kmPackageSchema>;
