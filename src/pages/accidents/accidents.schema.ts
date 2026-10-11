import * as yup from 'yup';
import { ACCIDENT_STATUSES, FAULT_PARTIES } from '@/constants/accidents';
import { FORM_MESSAGES } from '@/constants/messages';
import type { AccidentStatus, FaultParty } from '@/types/accidents.types';
import { amountField, idField } from '@/utils/validation';

export const accidentSchema = yup.object({
  carId: idField().optional(),
  rentalId: idField().optional(),
  faultParty: yup.mixed<FaultParty>().oneOf(FAULT_PARTIES).required(FORM_MESSAGES.REQUIRED),
  status: yup.mixed<AccidentStatus>().oneOf(ACCIDENT_STATUSES).required(FORM_MESSAGES.REQUIRED),
  estimatedCost: amountField().required(FORM_MESSAGES.REQUIRED),
  location: yup.string().trim().default(''),
  description: yup.string().trim().default(''),
});

export type AccidentFormValues = yup.InferType<typeof accidentSchema>;
