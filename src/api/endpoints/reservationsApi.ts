import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import type { ActiveDelivery, ReservationDetail, ReservationListItem } from '@/types/reservations.types';

export const reservationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReservations: build.query<Paged<ReservationListItem>, Query>({
      query: (params) => ({ url: '/reservations', params }),
      providesTags: ['Reservation'],
    }),
    getCustomerReservations: build.query<Paged<ReservationListItem>, { userId: string; query: Query }>({
      query: ({ userId, query }) => ({ url: `/users/${userId}/reservations`, params: query }),
      providesTags: ['Reservation'],
    }),
    getReservation: build.query<ReservationDetail, number | string>({
      query: (id) => `/reservations/${id}`,
      providesTags: ['Reservation'],
    }),
    getActiveDeliveries: build.query<ActiveDelivery[], void>({
      query: () => '/reservations/active-deliveries',
      providesTags: ['Reservation'],
    }),
    assignReservationDriver: build.mutation<unknown, { id: number; driverId: number }>({
      query: ({ id, driverId }) => ({ url: `/reservations/${id}/assign-driver`, method: 'POST', body: { driverId } }),
      invalidatesTags: ['Reservation', 'Driver', 'Dashboard'],
    }),
    cancelReservation: build.mutation<unknown, { id: number; reason: string }>({
      query: ({ id, reason }) => ({ url: `/reservations/${id}/cancel`, method: 'POST', body: { reason } }),
      invalidatesTags: ['Reservation', 'Driver', 'Dashboard'],
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useGetCustomerReservationsQuery,
  useGetReservationQuery,
  useGetActiveDeliveriesQuery,
  useAssignReservationDriverMutation,
  useCancelReservationMutation,
} = reservationsApi;
