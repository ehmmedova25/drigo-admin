import { baseApi } from '@/api/baseApi';
import type {
  CustomerFunnel,
  DailySeries,
  DebtBreakdown,
  DebtPoint,
  Demographics,
  FleetHealth,
  RevenuePoint,
  UtilizationPoint,
} from '@/types/analytics.types';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRevenueDaily: build.query<DailySeries<RevenuePoint>, number>({
      query: (days) => ({ url: '/analytics/revenue-daily', params: { days } }),
      providesTags: ['Analytics'],
    }),
    getUtilizationDaily: build.query<DailySeries<UtilizationPoint>, number>({
      query: (days) => ({ url: '/analytics/utilization-daily', params: { days } }),
      providesTags: ['Analytics'],
    }),
    getDebtDaily: build.query<DailySeries<DebtPoint>, number>({
      query: (days) => ({ url: '/analytics/debt-daily', params: { days } }),
      providesTags: ['Analytics'],
    }),
    getDebtBreakdown: build.query<DebtBreakdown, void>({
      query: () => '/analytics/debt-breakdown',
      providesTags: ['Analytics'],
    }),
    getCustomerFunnel: build.query<CustomerFunnel, void>({
      query: () => '/analytics/customer-funnel',
      providesTags: ['Analytics'],
    }),
    getDemographics: build.query<Demographics, void>({
      query: () => '/analytics/demographics',
      providesTags: ['Analytics'],
    }),
    getFleetHealth: build.query<FleetHealth, void>({
      query: () => '/analytics/fleet-health',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetRevenueDailyQuery,
  useGetUtilizationDailyQuery,
  useGetDebtDailyQuery,
  useGetDebtBreakdownQuery,
  useGetCustomerFunnelQuery,
  useGetDemographicsQuery,
  useGetFleetHealthQuery,
} = analyticsApi;
