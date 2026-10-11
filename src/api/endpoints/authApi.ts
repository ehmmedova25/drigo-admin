import { baseApi } from '@/api/baseApi';
import type { Admin, MyPermissions } from '@/types/auth.types';

interface LoginPayload {
  username: string;
  password: string;
}

interface VerifyPayload {
  username: string;
  code: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ username: string }, LoginPayload>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    verify: build.mutation<{ isVerified: boolean }, VerifyPayload>({
      query: (body) => ({ url: '/auth/verify', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    getMe: build.query<Admin, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    getMyPermissions: build.query<MyPermissions, void>({
      query: () => '/permissions/my-permissions',
      providesTags: ['Auth'],
    }),
    logout: build.mutation<unknown, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useVerifyMutation, useGetMeQuery, useGetMyPermissionsQuery, useLogoutMutation } = authApi;
