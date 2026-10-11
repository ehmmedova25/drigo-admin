import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import { FINE_MESSAGES } from '@/constants/messages';
import type { CarFinesDetail, CarFinesSummary, Fine, FineDecision, FineRentalOption, NewFine } from '@/types/fines.types';
import type { RentalDetail } from '@/types/rentals.types';

export const finesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFines: build.query<Paged<Fine>, Query>({
      query: (params) => ({ url: '/manual-fines', params }),
      providesTags: ['Fine'],
    }),
    getFinesForReview: build.query<Fine[], void>({
      query: () => '/manual-fines/review',
      providesTags: ['Fine'],
    }),
    getScraperFines: build.query<Paged<Fine>, Query>({
      query: (params) => ({ url: '/manual-fines/scraper', params }),
      providesTags: ['Fine'],
    }),
    getFinesByCar: build.query<Paged<CarFinesSummary>, Query>({
      query: (params) => ({ url: '/car-fines', params }),
      providesTags: ['Fine'],
    }),
    getCarFines: build.query<CarFinesDetail, number>({
      query: (carId) => `/car-fines/${carId}`,
      providesTags: ['Fine'],
    }),
    createFine: build.mutation<Fine, NewFine>({
      query: (body) => ({ url: '/manual-fines', method: 'POST', body }),
      invalidatesTags: ['Fine', 'Debt', 'Customer'],
    }),
    getFineRentalOptions: build.query<FineRentalOption[], number>({
      query: (fineId) => `/manual-fines/${fineId}/rental-options`,
      providesTags: ['Fine'],
    }),
    decideFine: build.mutation<unknown, { fineId: number; decision: FineDecision }>({
      query: ({ fineId, decision }) => ({ url: `/manual-fines/${fineId}/${decision}`, method: 'POST' }),
      invalidatesTags: ['Fine', 'Debt', 'Customer'],
    }),
    billFineToCustomer: build.mutation<unknown, { fine: Fine; rentalId?: number }>({
      queryFn: async ({ fine, rentalId }, _api, _extraOptions, baseQuery) => {
        if (!fine.userId) {
          if (!rentalId) return { error: { status: 'CUSTOM_ERROR', error: FINE_MESSAGES.RENTAL_REQUIRED } };
          const rentalResult = await baseQuery(`/rentals/${rentalId}`);
          if (rentalResult.error) return { error: rentalResult.error };
          const rental = rentalResult.data as RentalDetail;
          const linkResult = await baseQuery({
            url: `/manual-fines/${fine.id}`,
            method: 'PUT',
            body: { rentalId: rental.id, userId: rental.user.id },
          });
          if (linkResult.error) return { error: linkResult.error };
        }
        const result = await baseQuery({ url: `/manual-fines/${fine.id}/bill-customer`, method: 'POST' });
        return result.error ? { error: result.error } : { data: result.data };
      },
      invalidatesTags: ['Fine', 'Debt', 'Customer'],
    }),
  }),
});

export const {
  useGetFinesQuery,
  useGetFinesForReviewQuery,
  useGetScraperFinesQuery,
  useGetFinesByCarQuery,
  useGetCarFinesQuery,
  useCreateFineMutation,
  useGetFineRentalOptionsQuery,
  useDecideFineMutation,
  useBillFineToCustomerMutation,
} = finesApi;
