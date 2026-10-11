import { baseApi } from '@/api/baseApi';
import type { SuccessResponse } from '@/api/types';
import type { GasStation, GeoZone, GeoZonePayload, ParkingZone } from '@/types/geo.types';

export const geoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGeoZones: build.query<GeoZone[], void>({
      query: () => '/geozones',
      providesTags: ['Geo'],
    }),
    createGeoZone: build.mutation<GeoZone, GeoZonePayload>({
      query: (body) => ({ url: '/geozones', method: 'POST', body }),
      invalidatesTags: ['Geo'],
    }),
    updateGeoZone: build.mutation<GeoZone, { id: number; payload: GeoZonePayload }>({
      query: ({ id, payload }) => ({ url: `/geozones/${id}`, method: 'PUT', body: payload }),
      invalidatesTags: ['Geo'],
    }),
    deleteGeoZone: build.mutation<SuccessResponse, number>({
      query: (id) => ({ url: `/geozones/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Geo'],
    }),
    getParkingZones: build.query<ParkingZone[], void>({
      query: () => '/parkingZones',
      providesTags: ['Geo'],
    }),
    getGasStations: build.query<GasStation[], void>({
      query: () => '/gasStations',
      providesTags: ['Geo'],
    }),
  }),
});

export const {
  useGetGeoZonesQuery,
  useCreateGeoZoneMutation,
  useUpdateGeoZoneMutation,
  useDeleteGeoZoneMutation,
  useGetParkingZonesQuery,
  useGetGasStationsQuery,
} = geoApi;
