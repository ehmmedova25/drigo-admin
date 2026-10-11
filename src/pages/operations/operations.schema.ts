import * as yup from 'yup';
import { FORM_MESSAGES } from '@/constants/messages';
import { CAR_REPORT_DECISIONS, EMPLOYEE_ROLES } from '@/constants/operations';
import type { CarReportStatus } from '@/types/operations.types';

export const employeeSchema = yup.object({
  fullName: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
  role: yup.string().oneOf(EMPLOYEE_ROLES).required(FORM_MESSAGES.REQUIRED),
  phoneNumber: yup.string().default(''),
});

export type EmployeeFormValues = yup.InferType<typeof employeeSchema>;

export const carReportReviewSchema = yup.object({
  status: yup.mixed<CarReportStatus>().oneOf(CAR_REPORT_DECISIONS).required(FORM_MESSAGES.REQUIRED),
  note: yup.string().trim().default(''),
});

export type CarReportReviewFormValues = yup.InferType<typeof carReportReviewSchema>;

export const problemNoteSchema = yup.object({
  note: yup.string().trim().required(FORM_MESSAGES.REQUIRED),
});

export type ProblemNoteFormValues = yup.InferType<typeof problemNoteSchema>;
