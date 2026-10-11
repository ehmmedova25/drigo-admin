import * as yup from 'yup';
import { FINE_TYPES } from '@/constants/fines';
import { FORM_MESSAGES } from '@/constants/messages';
import { idField, numberField } from '@/utils/validation';

export const newFineSchema = yup.object({
  carId: idField().required(FORM_MESSAGES.REQUIRED),
  type: yup.string().oneOf(FINE_TYPES).required(FORM_MESSAGES.REQUIRED),
  amount: numberField().positive(FORM_MESSAGES.POSITIVE).required(FORM_MESSAGES.REQUIRED),
  location: yup.string().trim().default(''),
});

export type NewFineFormValues = yup.InferType<typeof newFineSchema>;

export const billCustomerSchema = yup.object({
  rentalId: idField().when('$needsRental', {
    is: true,
    then: (schema) => schema.required(FORM_MESSAGES.REQUIRED),
    otherwise: (schema) => schema.optional(),
  }),
});

export type BillCustomerFormValues = yup.InferType<typeof billCustomerSchema>;
