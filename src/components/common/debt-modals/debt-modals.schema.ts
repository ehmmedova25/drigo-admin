import * as yup from 'yup';
import { DEBT_TYPES, SPLIT_PARTS } from '@/constants/debts';
import { FORM_MESSAGES } from '@/constants/messages';
import { numberField } from '@/utils/validation';

export const addDebtSchema = yup.object({
  type: yup.string().oneOf(DEBT_TYPES).required(FORM_MESSAGES.REQUIRED),
  amount: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  description: yup.string().trim().default(''),
});

export type AddDebtFormValues = yup.InferType<typeof addDebtSchema>;

export const splitDebtSchema = yup.object({
  parts: numberField()
    .integer(FORM_MESSAGES.INTEGER)
    .min(SPLIT_PARTS.min, FORM_MESSAGES.SPLIT_PARTS_RANGE)
    .max(SPLIT_PARTS.max, FORM_MESSAGES.SPLIT_PARTS_RANGE)
    .required(FORM_MESSAGES.REQUIRED),
});

export type SplitDebtFormValues = yup.InferType<typeof splitDebtSchema>;
