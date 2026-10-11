import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import type { CustomerDebts, DebtRow, Debtor, NewDebt } from '@/types/debts.types';
import { apiUrl } from '@/utils/apiUrl';

const userDebt = (userId: string) => `/users/${userId}/debt`;

export const DEBT_REPORT_URL = apiUrl('/users/with-debt/report');

export const debtsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDebtors: build.query<Paged<Debtor>, Query>({
      query: (params) => ({ url: '/users/with-debt', params }),
      providesTags: ['Debt'],
    }),
    getDebts: build.query<Paged<DebtRow>, Query>({
      query: (params) => ({ url: '/debts', params }),
      providesTags: ['Debt'],
    }),
    getCustomerDebts: build.query<CustomerDebts, string>({
      query: (userId) => userDebt(userId),
      providesTags: ['Debt'],
    }),
    addCustomerDebt: build.mutation<unknown, { userId: string; debt: NewDebt }>({
      query: ({ userId, debt }) => ({ url: userDebt(userId), method: 'POST', body: debt }),
      invalidatesTags: ['Debt', 'Customer', 'Dashboard'],
    }),
    deleteCustomerDebt: build.mutation<SuccessResponse, { userId: string; debtId: number }>({
      query: ({ userId, debtId }) => ({ url: `${userDebt(userId)}/${debtId}`, method: 'DELETE' }),
      invalidatesTags: ['Debt', 'Customer', 'Dashboard'],
    }),
    payAllDebts: build.mutation<{ paidCount: number }, string>({
      query: (userId) => ({ url: `${userDebt(userId)}/pay`, method: 'POST' }),
      invalidatesTags: ['Debt', 'Customer', 'Dashboard'],
    }),
    paySelectedDebts: build.mutation<{ paidCount: number }, { userId: string; debtIds: number[] }>({
      query: ({ userId, debtIds }) => ({ url: `${userDebt(userId)}/pay-selected`, method: 'POST', body: { debtIds } }),
      invalidatesTags: ['Debt', 'Customer', 'Dashboard'],
    }),
    payDebt: build.mutation<unknown, { userId: string; debtId: number }>({
      query: ({ userId, debtId }) => ({ url: `${userDebt(userId)}/${debtId}/pay`, method: 'POST' }),
      invalidatesTags: ['Debt', 'Customer', 'Dashboard'],
    }),
    splitDebt: build.mutation<unknown, { userId: string; debtId: number; parts: number }>({
      query: ({ userId, debtId, parts }) => ({ url: `${userDebt(userId)}/${debtId}/split`, method: 'POST', body: { parts } }),
      invalidatesTags: ['Debt', 'Customer', 'Dashboard'],
    }),
  }),
});

export const {
  useGetDebtorsQuery,
  useGetDebtsQuery,
  useGetCustomerDebtsQuery,
  useAddCustomerDebtMutation,
  useDeleteCustomerDebtMutation,
  usePayAllDebtsMutation,
  usePaySelectedDebtsMutation,
  usePayDebtMutation,
  useSplitDebtMutation,
} = debtsApi;
