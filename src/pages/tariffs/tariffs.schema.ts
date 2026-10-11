import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { TIME_UNITS } from '@/constants/tariffs';
import type { TimeUnit } from '@/types/tariffs.types';
import { amountField, idField, numberField } from '@/utils/validation';

export const packageSchema = yup.object({
  unitCount: idField().required(FORM_MESSAGES.REQUIRED),
  timeUnit: yup.mixed<TimeUnit>().oneOf(TIME_UNITS).required(FORM_MESSAGES.REQUIRED),
  price: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  isActive: yup.boolean().required(),
});

export type PackageFormValues = yup.InferType<typeof packageSchema>;

export const planSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  description: yup.string().default(''),
  isActive: yup.boolean().required(),
});

export type PlanFormValues = yup.InferType<typeof planSchema>;

export const templateSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  description: yup.string().default(''),
});

export type TemplateFormValues = yup.InferType<typeof templateSchema>;

export const overageSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  pricePerKm: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  thresholdKm: amountField().integer(FORM_MESSAGES.INTEGER).required(FORM_MESSAGES.REQUIRED),
  isActive: yup.boolean().required(),
});

export type OverageFormValues = yup.InferType<typeof overageSchema>;

export const templateTariffSchema = yup.object({
  packageName: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  price: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
});

export type TemplateTariffFormValues = yup.InferType<typeof templateTariffSchema>;
