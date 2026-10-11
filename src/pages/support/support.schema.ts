import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';

export const replySchema = yup.object({
  message: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
});

export type ReplyFormValues = yup.InferType<typeof replySchema>;
