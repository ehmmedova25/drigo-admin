import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_PREFIX } from '@/constants/config';
import { env } from '@/constants/env';
import type { Query } from './types';
import { API_TAGS } from './tags';

const AUTH_PATH = '/auth/';
const METHODS_WITH_BODY = ['POST', 'PUT', 'PATCH'];

const cleanParams = (params?: Query) =>
  params && Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${env.apiBaseUrl}${API_PREFIX}`,
  credentials: 'include',
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const request = typeof args === 'string' ? { url: args } : args;
  const method = (request.method ?? 'GET').toUpperCase();
  const needsBody = METHODS_WITH_BODY.includes(method) && request.body === undefined;

  const result = await rawBaseQuery(
    { ...request, params: cleanParams(request.params), body: needsBody ? {} : request.body },
    api,
    extraOptions,
  );

  if (result.error?.status === 401 && !request.url.startsWith(AUTH_PATH)) {
    api.dispatch(baseApi.util.resetApiState());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: API_TAGS,
  endpoints: () => ({}),
});
