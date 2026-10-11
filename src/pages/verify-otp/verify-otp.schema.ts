import * as yup from 'yup';
import { AUTH_MESSAGES } from '@/constants/messages';

export const OTP_LENGTH = 6;

export const verifyOtpSchema = yup.object({
  code: yup
    .string()
    .required(AUTH_MESSAGES.VERIFY.CODE_REQUIRED)
    .matches(new RegExp(`^\\d{${OTP_LENGTH}}$`), AUTH_MESSAGES.VERIFY.CODE_FORMAT),
});

export type VerifyOtpFormValues = yup.InferType<typeof verifyOtpSchema>;
