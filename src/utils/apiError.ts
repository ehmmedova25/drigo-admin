import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { COMMON_MESSAGES } from '@/constants/messages';

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

const hasMessage = (value: unknown): value is { message: unknown } =>
  typeof value === 'object' && value !== null && 'message' in value;

export const getErrorMessage = (error: unknown): string => {
  if (isFetchBaseQueryError(error)) {
    if (hasMessage(error.data)) return String(error.data.message);
    if (typeof error.status === 'number') return `${COMMON_MESSAGES.REQUEST_FAILED} (${error.status})`;
    if (error.status === 'CUSTOM_ERROR') return error.error;
    return COMMON_MESSAGES.NETWORK_ERROR;
  }
  if (hasMessage(error)) return String(error.message);
  return COMMON_MESSAGES.UNKNOWN_ERROR;
};

export const getOptionalErrorMessage = (error: unknown): string | null => (error ? getErrorMessage(error) : null);
