import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import type { CustomerDetail, CustomerListItem, CustomerRevenue, Device, LoginRecord, RejectionReason } from '@/types/customers.types';
import type { Payment } from '@/types/rentals.types';

export const customersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomers: build.query<Paged<CustomerListItem>, Query>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['Customer'],
    }),
    getCustomer: build.query<CustomerDetail, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['Customer'],
    }),
    getCustomerRevenue: build.query<CustomerRevenue, string>({
      query: (id) => `/users/${id}/revenue`,
      providesTags: ['Customer'],
    }),
    getCustomerRejectionReasons: build.query<RejectionReason[], void>({
      query: () => '/users/rejection-reasons',
    }),
    approveCustomer: build.mutation<unknown, string>({
      query: (id) => ({ url: `/users/${id}/verify`, method: 'PUT', body: { approve: true } }),
      invalidatesTags: ['Customer', 'Dashboard'],
    }),
    rejectCustomer: build.mutation<unknown, { id: string; rejectionReason: string }>({
      query: ({ id, rejectionReason }) => ({ url: `/users/${id}/verify`, method: 'PUT', body: { approve: false, rejectionReason } }),
      invalidatesTags: ['Customer', 'Dashboard'],
    }),
    setCustomerBlocked: build.mutation<unknown, { id: string; blocked: boolean; reason?: string }>({
      query: ({ id, blocked, reason }) => ({ url: `/users/${id}/block`, method: 'PATCH', body: { blocked, reason } }),
      invalidatesTags: ['Customer', 'Dashboard'],
    }),
    deleteCustomer: build.mutation<SuccessResponse, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Customer', 'Dashboard'],
    }),
    restoreCustomer: build.mutation<SuccessResponse, string>({
      query: (id) => ({ url: `/users/${id}/restore`, method: 'POST' }),
      invalidatesTags: ['Customer', 'Dashboard'],
    }),
    getCustomerPayments: build.query<Paged<Payment>, { id: string; query: Query }>({
      query: ({ id, query }) => ({ url: `/users/${id}/payments`, params: query }),
      providesTags: ['Customer'],
    }),
    getCustomerBonus: build.query<{ balance: number; currency: string }, string>({
      query: (id) => `/users/${id}/bonus`,
      providesTags: ['Customer'],
    }),
    addCustomerBonus: build.mutation<unknown, { id: string; amount: number }>({
      query: ({ id, amount }) => ({ url: `/users/${id}/bonus`, method: 'POST', body: { amount } }),
      invalidatesTags: ['Customer', 'Dashboard'],
    }),
    getCustomerDevices: build.query<Device[], string>({
      query: (id) => `/users/${id}/devices`,
      providesTags: ['Customer'],
    }),
    getCustomerLoginHistory: build.query<Paged<LoginRecord>, { id: string; query: Query }>({
      query: ({ id, query }) => ({ url: `/users/${id}/login-history`, params: query }),
      providesTags: ['Customer'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useGetCustomerRevenueQuery,
  useGetCustomerRejectionReasonsQuery,
  useApproveCustomerMutation,
  useRejectCustomerMutation,
  useSetCustomerBlockedMutation,
  useDeleteCustomerMutation,
  useRestoreCustomerMutation,
  useGetCustomerPaymentsQuery,
  useGetCustomerBonusQuery,
  useAddCustomerBonusMutation,
  useGetCustomerDevicesQuery,
  useGetCustomerLoginHistoryQuery,
} = customersApi;
