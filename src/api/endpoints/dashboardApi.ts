import { baseApi } from '@/api/baseApi';
import type { ActivityItem, FleetSummary, Kpis, OnlineUser, Trends } from '@/types/dashboard.types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardKpis: build.query<Kpis, void>({
      query: () => '/dashboard/kpis',
      providesTags: ['Dashboard'],
    }),
    getDashboardTrends: build.query<Trends, void>({
      query: () => '/dashboard/trends',
      providesTags: ['Dashboard'],
    }),
    getDashboardFleet: build.query<FleetSummary, void>({
      query: () => '/dashboard/fleet',
      providesTags: ['Dashboard'],
    }),
    getDashboardRecentActivity: build.query<{ activity: ActivityItem[] }, void>({
      query: () => '/dashboard/recent-activity',
      providesTags: ['Dashboard'],
    }),
    getOnlineUsers: build.query<OnlineUser[], void>({
      query: () => '/dashboard/online-users',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardKpisQuery,
  useGetDashboardTrendsQuery,
  useGetDashboardFleetQuery,
  useGetDashboardRecentActivityQuery,
  useGetOnlineUsersQuery,
} = dashboardApi;
