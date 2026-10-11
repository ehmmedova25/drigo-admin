import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import type { Container, DatabaseInfo, LogLine, MonitoringOverview, TelematicsDevice } from '@/types/monitoring.types';

export const monitoringApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMonitoringOverview: build.query<MonitoringOverview, void>({
      query: () => '/monitoring/overview',
      providesTags: ['Monitoring'],
    }),
    getMonitoringContainers: build.query<Container[], void>({
      query: () => '/monitoring/docker',
      providesTags: ['Monitoring'],
    }),
    getMonitoringDatabase: build.query<DatabaseInfo, void>({
      query: () => '/monitoring/database',
      providesTags: ['Monitoring'],
    }),
    getMonitoringLogs: build.query<Paged<LogLine>, Query>({
      query: (params) => ({ url: '/monitoring/logs', params }),
      providesTags: ['Monitoring'],
    }),
    getTelematicsDevices: build.query<Paged<TelematicsDevice>, Query>({
      query: (params) => ({ url: '/cars/connected-devices', params }),
      providesTags: ['Monitoring'],
    }),
  }),
});

export const {
  useGetMonitoringOverviewQuery,
  useGetMonitoringContainersQuery,
  useGetMonitoringDatabaseQuery,
  useGetMonitoringLogsQuery,
  useGetTelematicsDevicesQuery,
} = monitoringApi;
