import * as yup from 'yup';
import { MIN_PASSWORD_LENGTH } from '@/constants/admins';
import { FORM_MESSAGES } from '@/constants/messages';

export const addAdminSchema = yup.object({
  username: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  password: yup.string().required(FORM_MESSAGES.REQUIRED).min(MIN_PASSWORD_LENGTH, FORM_MESSAGES.PASSWORD_TOO_SHORT),
  fullName: yup.string().trim().default(''),
  email: yup.string().trim().email(FORM_MESSAGES.EMAIL).default(''),
  isSuperAdmin: yup.boolean().default(false),
});

export type AddAdminFormValues = yup.InferType<typeof addAdminSchema>;

export const permissionsSchema = yup.object({
  permissionCodes: yup.array(yup.string().required()).required(),
});

export type PermissionsFormValues = yup.InferType<typeof permissionsSchema>;
