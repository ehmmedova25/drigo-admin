import { baseApi } from '@/api/baseApi';
import type { MonthlyReport, MonthRow, Statistics } from '@/types/reports.types';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMonthlyReport: build.query<MonthlyReport, number>({
      query: (months) => ({ url: '/reports/monthly', params: { months } }),
      providesTags: ['Report'],
    }),
    getMonthReport: build.query<MonthRow, string>({
      query: (month) => `/reports/monthly/${month}`,
      providesTags: ['Report'],
    }),
    getReportStatistics: build.query<Statistics, void>({
      query: () => '/reports/statistics',
      providesTags: ['Report'],
    }),
  }),
});

export const { useGetMonthlyReportQuery, useGetMonthReportQuery, useGetReportStatisticsQuery } = reportsApi;
