import * as yup from 'yup';
import { AUTH_MESSAGES } from '@/constants/messages';

export const loginSchema = yup.object({
  username: yup.string().trim().required(AUTH_MESSAGES.LOGIN.USERNAME_REQUIRED),
  password: yup.string().required(AUTH_MESSAGES.LOGIN.PASSWORD_REQUIRED),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
