import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import type { CarUtilization, CityTarget, FleetMove, FleetPlan, UtilizationSummary } from '@/types/fleet.types';

export const fleetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFleetPlan: build.query<FleetPlan, void>({
      query: () => '/fleetplan',
      providesTags: ['Fleet'],
    }),
    saveFleetPlan: build.mutation<FleetPlan, CityTarget[]>({
      query: (targets) => ({ url: '/fleetplan', method: 'PUT', body: { targets } }),
      invalidatesTags: ['Fleet'],
    }),
    getFleetMoves: build.query<FleetMove[], void>({
      query: () => '/fleet-moves',
      providesTags: ['Fleet'],
    }),
    getFleetUtilizationSummary: build.query<UtilizationSummary, void>({
      query: () => '/fleet-utilization/summary',
      providesTags: ['Fleet'],
    }),
    getFleetUtilizationByCar: build.query<Paged<CarUtilization>, Query>({
      query: (params) => ({ url: '/fleet-utilization/by-car', params }),
      providesTags: ['Fleet'],
    }),
  }),
});

export const {
  useGetFleetPlanQuery,
  useSaveFleetPlanMutation,
  useGetFleetMovesQuery,
  useGetFleetUtilizationSummaryQuery,
  useGetFleetUtilizationByCarQuery,
} = fleetApi;
