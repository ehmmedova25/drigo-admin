import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { numberField } from '@/utils/validation';

export const cityTargetsSchema = yup.object({
  targets: yup
    .array(
      yup.object({
        city: yup.string().required(FORM_MESSAGES.REQUIRED),
        currentCars: yup.number().required(FORM_MESSAGES.REQUIRED),
        targetCars: numberField().integer(FORM_MESSAGES.INTEGER).min(0, FORM_MESSAGES.NOT_NEGATIVE).required(FORM_MESSAGES.REQUIRED),
      }),
    )
    .required(),
});

export type CityTargetsFormValues = yup.InferType<typeof cityTargetsSchema>;
