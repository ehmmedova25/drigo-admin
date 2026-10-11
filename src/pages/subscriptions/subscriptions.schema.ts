import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { amountField, idField, numberField } from '@/utils/validation';

export const planSchema = yup.object({
  monthlyPrice: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  includedKm: amountField().integer(FORM_MESSAGES.INTEGER).required(FORM_MESSAGES.REQUIRED),
  minMonths: idField().required(FORM_MESSAGES.REQUIRED),
});

export type PlanFormValues = yup.InferType<typeof planSchema>;

export const assignCarSchema = yup.object({
  carId: idField().required(FORM_MESSAGES.REQUIRED),
});

export type AssignCarFormValues = yup.InferType<typeof assignCarSchema>;
