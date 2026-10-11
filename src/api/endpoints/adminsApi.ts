import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import type { AdminPermissions, NewAdminPayload } from '@/types/admins.types';
import type { Admin } from '@/types/auth.types';

const adminPermissions = (adminId: string) => `/permissions/admins/${adminId}`;

export const adminsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdmins: build.query<Paged<Admin>, Query>({
      query: (params) => ({ url: '/auth', params }),
      providesTags: ['Admin'],
    }),
    createAdmin: build.mutation<Admin, NewAdminPayload>({
      query: (body) => ({ url: '/auth/add-user', method: 'POST', body }),
      invalidatesTags: ['Admin'],
    }),
    getAdminPermissions: build.query<AdminPermissions, string>({
      query: (adminId) => adminPermissions(adminId),
      providesTags: ['Admin'],
    }),
    saveAdminPermissions: build.mutation<unknown, { adminId: string; permissionCodes: string[] }>({
      query: ({ adminId, permissionCodes }) => ({ url: adminPermissions(adminId), method: 'PUT', body: { permissionCodes } }),
      invalidatesTags: ['Admin', 'Auth'],
    }),
    setAdminSuperAdmin: build.mutation<unknown, { adminId: string; isSuperAdmin: boolean }>({
      query: ({ adminId, isSuperAdmin }) => ({ url: `${adminPermissions(adminId)}/super-admin`, method: 'PUT', body: { isSuperAdmin } }),
      invalidatesTags: ['Admin', 'Auth'],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useGetAdminPermissionsQuery,
  useSaveAdminPermissionsMutation,
  useSetAdminSuperAdminMutation,
} = adminsApi;
