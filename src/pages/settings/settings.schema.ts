import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { COUNTRY_CODE_LENGTH } from '@/constants/settings';
import { amountField } from '@/utils/validation';

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

export const serviceFeeSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  amount: amountField().required(FORM_MESSAGES.REQUIRED),
  isPercentage: yup.boolean().default(false),
  isActive: yup.boolean().default(true),
});

export type ServiceFeeFormValues = yup.InferType<typeof serviceFeeSchema>;

export const penaltySchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  amount: amountField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  isActive: yup.boolean().default(true),
});

export type PenaltyFormValues = yup.InferType<typeof penaltySchema>;

export const singleValueSchema = yup.object({
  value: amountField().required(FORM_MESSAGES.REQUIRED),
  isActive: yup.boolean().default(true),
});

export type SingleValueFormValues = yup.InferType<typeof singleValueSchema>;

export const blockIpSchema = yup.object({
  value: yup.string().trim().required(FORM_MESSAGES.REQUIRED).matches(IPV4, FORM_MESSAGES.IPV4),
  reason: yup.string().trim().default(''),
});

export const blockCountrySchema = yup.object({
  value: yup
    .string()
    .trim()
    .uppercase()
    .required(FORM_MESSAGES.REQUIRED)
    .length(COUNTRY_CODE_LENGTH, FORM_MESSAGES.COUNTRY_CODE),
  reason: yup.string().trim().default(''),
});

export type BlockEntryFormValues = yup.InferType<typeof blockIpSchema>;

export const smsCountriesSchema = yup.object({
  countries: yup.string().default(''),
});

export type SmsCountriesFormValues = yup.InferType<typeof smsCountriesSchema>;
