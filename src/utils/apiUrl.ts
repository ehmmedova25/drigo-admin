import { API_PREFIX } from '@/constants/config';
import { env } from '@/constants/env';

export const apiUrl = (path: string): string => `${env.apiBaseUrl}${API_PREFIX}${path}`;
