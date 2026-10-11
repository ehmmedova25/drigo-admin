import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { numberField } from '@/utils/validation';

export const rejectSchema = yup.object({
  reason: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
});

export type RejectFormValues = yup.InferType<typeof rejectSchema>;

export const blockSchema = yup.object({
  reason: yup.string().trim().default(''),
});

export type BlockFormValues = yup.InferType<typeof blockSchema>;

export const bonusSchema = yup.object({
  amount: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
});

export type BonusFormValues = yup.InferType<typeof bonusSchema>;
