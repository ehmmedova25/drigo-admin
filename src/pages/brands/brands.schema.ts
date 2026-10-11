import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { hexColorField } from '@/utils/validation';

export const nameSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
});

export type NameFormValues = yup.InferType<typeof nameSchema>;

export const brandColorSchema = yup.object({
  name: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  hexCode: hexColorField().trim().required(FORM_MESSAGES.REQUIRED),
});

export type BrandColorFormValues = yup.InferType<typeof brandColorSchema>;
