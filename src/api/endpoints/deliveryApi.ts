import { baseApi } from '@/api/baseApi';
import type { Paged, Query, SuccessResponse } from '@/api/types';
import { PAGE_SIZE } from '@/constants/config';
import type { Driver, DriverPayload, Zone, ZonePayload } from '@/types/delivery.types';

export const deliveryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDrivers: build.query<Paged<Driver>, Query>({
      query: (params) => ({ url: '/deliveryDrivers', params }),
      providesTags: ['Driver'],
    }),
    getAllDrivers: build.query<Driver[], void>({
      query: () => ({ url: '/deliveryDrivers', params: { pageSize: PAGE_SIZE.lookup } }),
      transformResponse: (res: Paged<Driver>) => res.data,
      providesTags: ['Driver'],
    }),
    createDriver: build.mutation<Driver, DriverPayload>({
      query: (body) => ({ url: '/deliveryDrivers', method: 'POST', body }),
      invalidatesTags: ['Driver'],
    }),
    updateDriver: build.mutation<Driver, { id: number; payload: DriverPayload }>({
      query: ({ id, payload }) => ({ url: `/deliveryDrivers/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Driver'],
    }),
    deleteDriver: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/deliveryDrivers/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Driver'],
    }),
    getZones: build.query<Paged<Zone>, Query>({
      query: (params) => ({ url: '/deliveryZones', params }),
      providesTags: ['Zone'],
    }),
    createZone: build.mutation<Zone, ZonePayload>({
      query: (body) => ({ url: '/deliveryZones', method: 'POST', body }),
      invalidatesTags: ['Zone'],
    }),
    updateZone: build.mutation<Zone, { id: number; payload: ZonePayload }>({
      query: ({ id, payload }) => ({ url: `/deliveryZones/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Zone'],
    }),
    deleteZone: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/deliveryZones/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Zone'],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetAllDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useGetZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} = deliveryApi;
