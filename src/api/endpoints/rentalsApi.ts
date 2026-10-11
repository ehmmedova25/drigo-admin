import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import type { KmPackageOption, Payment, RentalDetail, RentalListItem, RentalRoute, RentalStatus } from '@/types/rentals.types';

export const rentalsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRentals: build.query<Paged<RentalListItem>, Query>({
      query: (params) => ({ url: '/rentals', params }),
      providesTags: ['Rental'],
    }),
    getRental: build.query<RentalDetail, number | string>({
      query: (id) => `/rentals/${id}`,
      providesTags: ['Rental'],
    }),
    getRentalPayments: build.query<Payment[], number | string>({
      query: (id) => `/rentals/${id}/payments`,
      providesTags: ['Rental'],
    }),
    getRentalRoute: build.query<RentalRoute, number | string>({
      query: (id) => `/rentals/${id}/route`,
      providesTags: ['Rental'],
    }),
    getKmPackageOptions: build.query<KmPackageOption[], number>({
      query: (id) => `/rentals/${id}/km-package-options`,
    }),
    endRental: build.mutation<RentalDetail, number>({
      query: (id) => `/rentals/${id}/end`,
      invalidatesTags: ['Rental', 'Car', 'Customer', 'Debt', 'Dashboard'],
    }),
    switchRentalCar: build.mutation<unknown, { id: number; carId: number }>({
      query: ({ id, carId }) => ({ url: `/rentals/${id}/switch-car`, params: { carId } }),
      invalidatesTags: ['Rental', 'Car', 'Dashboard'],
    }),
    setRentalStatus: build.mutation<unknown, { id: number; status: RentalStatus }>({
      query: ({ id, status }) => ({ url: `/rentals/${id}/status`, params: { status } }),
      invalidatesTags: ['Rental', 'Car', 'Dashboard'],
    }),
    addCompensationKm: build.mutation<unknown, { id: number; km: number; reason: string }>({
      query: ({ id, km, reason }) => ({ url: `/rentals/${id}/comp-km`, method: 'POST', body: { km, reason } }),
      invalidatesTags: ['Rental'],
    }),
    addKmPackage: build.mutation<unknown, { id: number; option: KmPackageOption }>({
      query: ({ id, option }) => ({ url: `/rentals/${id}/add-km-package`, method: 'POST', body: { km: option.km, price: option.price } }),
      invalidatesTags: ['Rental'],
    }),
    retryPayment: build.mutation<{ status: Payment['status'] }, { userId: string; paymentId: number }>({
      query: ({ userId, paymentId }) => ({ url: `/users/${userId}/payments/${paymentId}/retry`, method: 'POST' }),
      invalidatesTags: ['Rental', 'Customer', 'Debt'],
    }),
  }),
});

export const {
  useGetRentalsQuery,
  useGetRentalQuery,
  useGetRentalPaymentsQuery,
  useGetRentalRouteQuery,
  useGetKmPackageOptionsQuery,
  useEndRentalMutation,
  useSwitchRentalCarMutation,
  useSetRentalStatusMutation,
  useAddCompensationKmMutation,
  useAddKmPackageMutation,
  useRetryPaymentMutation,
} = rentalsApi;
