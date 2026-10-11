import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import type {
  BusinessInquiry,
  CarReport,
  CarReportStatus,
  CarService,
  Cleaning,
  CleaningStats,
  Employee,
  EmployeePayload,
  ExitSurvey,
  InquiryStatus,
  ProblemReport,
  ProblemStatus,
  ServiceStatus,
} from '@/types/operations.types';

export const operationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCleanings: build.query<Paged<Cleaning>, Query>({
      query: (params) => ({ url: '/cleanings', params }),
      providesTags: ['Operations'],
    }),
    getCleaningStats: build.query<CleaningStats, void>({
      query: () => '/cleanings/stats',
      providesTags: ['Operations'],
    }),
    cancelCleaning: build.mutation<unknown, number>({
      query: (id) => ({ url: `/cleanings/${id}/cancel`, method: 'PUT' }),
      invalidatesTags: ['Operations'],
    }),
    getCarReports: build.query<Paged<CarReport>, Query>({
      query: (params) => ({ url: '/car-reports', params }),
      providesTags: ['Operations'],
    }),
    reviewCarReport: build.mutation<unknown, { id: number; status: CarReportStatus; note: string }>({
      query: ({ id, status, note }) => ({ url: `/car-reports/${id}/review`, method: 'PUT', body: { status, note } }),
      invalidatesTags: ['Operations'],
    }),
    getProblemReports: build.query<Paged<ProblemReport>, Query>({
      query: (params) => ({ url: '/problemreports', params }),
      providesTags: ['Operations'],
    }),
    setProblemReportStatus: build.mutation<unknown, { id: number; status: ProblemStatus }>({
      query: ({ id, status }) => ({ url: `/problemreports/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Operations'],
    }),
    setProblemReportNote: build.mutation<unknown, { id: number; note: string }>({
      query: ({ id, note }) => ({ url: `/problemreports/${id}/note`, method: 'PUT', body: { note } }),
      invalidatesTags: ['Operations'],
    }),
    getCarServices: build.query<Paged<CarService>, Query>({
      query: (params) => ({ url: '/car-services', params }),
      providesTags: ['Operations'],
    }),
    setCarServiceStatus: build.mutation<unknown, { id: number; status: ServiceStatus }>({
      query: ({ id, status }) => ({ url: `/car-services/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Operations'],
    }),
    getEmployees: build.query<Employee[], void>({
      query: () => '/employees',
      providesTags: ['Operations'],
    }),
    createEmployee: build.mutation<Employee, EmployeePayload>({
      query: (body) => ({ url: '/employees', method: 'POST', body }),
      invalidatesTags: ['Operations'],
    }),
    toggleEmployeeActive: build.mutation<{ isActive: boolean }, number>({
      query: (id) => ({ url: `/employees/${id}/toggle-active`, method: 'PUT' }),
      invalidatesTags: ['Operations'],
    }),
    getBusinessInquiries: build.query<Paged<BusinessInquiry>, Query>({
      query: (params) => ({ url: '/businessinquiries', params }),
      providesTags: ['Operations'],
    }),
    setBusinessInquiryStatus: build.mutation<unknown, { id: number; status: InquiryStatus }>({
      query: ({ id, status }) => ({ url: `/businessinquiries/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Operations'],
    }),
    getExitSurveys: build.query<Paged<ExitSurvey>, Query>({
      query: (params) => ({ url: '/exit-surveys', params }),
      providesTags: ['Operations'],
    }),
  }),
});

export const {
  useGetCleaningsQuery,
  useGetCleaningStatsQuery,
  useCancelCleaningMutation,
  useGetCarReportsQuery,
  useReviewCarReportMutation,
  useGetProblemReportsQuery,
  useSetProblemReportStatusMutation,
  useSetProblemReportNoteMutation,
  useGetCarServicesQuery,
  useSetCarServiceStatusMutation,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useToggleEmployeeActiveMutation,
  useGetBusinessInquiriesQuery,
  useSetBusinessInquiryStatusMutation,
  useGetExitSurveysQuery,
} = operationsApi;
