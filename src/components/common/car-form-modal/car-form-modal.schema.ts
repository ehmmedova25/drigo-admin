import * as yup from 'yup';
import { TRANSMISSIONS } from '@/constants/cars';
import { FORM_MESSAGES } from '@/constants/messages';
import { amountField, idField, numberField } from '@/utils/validation';

export const carSchema = yup.object({
  brandId: idField().required(FORM_MESSAGES.REQUIRED),
  modelId: idField().optional(),
  colorId: idField().optional(),
  fuelTypeId: idField().optional(),
  transmission: numberField()
    .oneOf(TRANSMISSIONS.map((t) => t.value))
    .required(FORM_MESSAGES.REQUIRED),
  plateNumber: yup.string().trim().default(''),
  manufactureYear: numberField().integer(FORM_MESSAGES.INTEGER).positive(FORM_MESSAGES.POSITIVE).optional(),
  maxSpeed: numberField().integer(FORM_MESSAGES.INTEGER).positive(FORM_MESSAGES.POSITIVE).optional(),
  engineCapacity: amountField().optional(),
  distance: amountField().optional(),
  chassisNumber: yup.string().trim().default(''),
});

export type CarFormValues = yup.InferType<typeof carSchema>;
